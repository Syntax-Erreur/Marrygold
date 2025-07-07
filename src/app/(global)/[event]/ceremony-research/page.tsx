"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "./MainLayout";
import SearchBar from "./SearchBar";
import Header from "./Header";
import { blogService, BlogPost } from "@/lib/firebase/blog-service";
import { auth } from "@/lib/firebase";
import { validateEvent } from "@/lib/firebase/guest-service";
import { toast } from "sonner";
import mockBlogPosts from "@/lib/mock/blog-data";

const CeremonyResearch: React.FC = () => {
  const { event } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contents, setContents] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchEventContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!auth.currentUser) {
          router.push('/login');
          return;
        }

        const eventSlug = decodeURIComponent(String(event));

        const eventExists = await validateEvent(eventSlug);
        if (!eventExists) {
          setError(`Event "${eventSlug}" not found or you don't have access to it`);
          return;
        }

        // Get mock data for this event
        const eventMockPosts = mockBlogPosts.filter(post => post.eventSlug === eventSlug);

        // If we have mock data for this event, use it
        if (eventMockPosts.length > 0) {
          console.log(`Using mock data for "${eventSlug}" event`);
          setContents(eventMockPosts);
        } else {
          // Otherwise try to get real data
          try {
            const posts = await blogService.getAllPosts(eventSlug);
            if (posts.length > 0) {
              setContents(posts);
            } else {
              // If no real data, show mock data to demonstrate UI
              console.log("No real data found, using sample mock data");
              setContents(mockBlogPosts.slice(0, 3).map(post => ({
                ...post,
                eventSlug
              })));
            }
          } catch (err) {
            console.error("Error fetching from Firestore:", err);
            // Fallback to mock data
            setContents(eventMockPosts.length > 0 ? eventMockPosts : []);
          }
        }
      } catch (err) {
        console.error("Error fetching event content:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load content";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventContent();
  }, [event, router]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <p className="text-red-600">{error}</p>
          {error.includes("not found") && (
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-10">
        <Header />
      </header>
      <SearchBar />
      <main>
        {contents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No research content yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start by adding some ceremony research content for {decodeURIComponent(String(event))}.
            </p>
            <button
              onClick={() => window.location.href = `/${event}/ceremony-research/create`}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Create New Content
            </button>
          </div>
        ) : (
          <MainLayout contents={contents} />
        )}
      </main>
    </div>
  );
};

export default CeremonyResearch;
