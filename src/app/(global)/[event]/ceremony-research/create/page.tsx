'use client';

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import Header from "./GuestList/Header";
import SearchBar from "../SearchBar";
import { blogService } from "@/lib/firebase/blog-service";
import { validateEvent } from "@/lib/firebase/guest-service";
import { toast } from "sonner";

const ContentEditor = dynamic(
  () => import("./GuestList/ContentEditor").then((mod) => mod.ContentEditor),
  { ssr: false }
);

const CreateArticle: React.FC = () => {
  const router = useRouter();
  const { event } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  // Validate event on mount
  useEffect(() => {
    const validateEventSlug = async () => {
      try {
        const eventSlug = decodeURIComponent(String(event));
        const isValid = await validateEvent(eventSlug);
        
        if (!isValid) {
          setError(`Event "${eventSlug}" not found`);
          toast.error(`Invalid event: ${eventSlug}`);
        }
      } catch (err) {
        setError("Failed to validate event");
        toast.error("Error validating event");
      } finally {
        setIsValidating(false);
      }
    };

    validateEventSlug();
  }, [event]);

  const onSave = async (content: string, title: string, imageUrl?: string, publish = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get event slug from URL params
      const eventSlug = decodeURIComponent(String(event));
      
      // Validate event again before publishing
      const isValid = await validateEvent(eventSlug);
      if (!isValid) {
        throw new Error(`Invalid event: ${eventSlug}`);
      }

      // Extract first image from content if no imageUrl provided
      if (!imageUrl && content.includes('<img')) {
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        imageUrl = imgMatch ? imgMatch[1] : '';
      }

      // Create post with proper data structure
      await blogService.createPost(eventSlug, {
        title,
        content,
        imageUrl,
        eventSlug,
        isPublished: publish
      });

      toast.success(`Content published successfully for ${eventSlug}!`);
      router.push(`/${eventSlug}/ceremony-research`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save article";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
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
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex min-h-[1213px] w-full flex-col items-stretch max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="bg-white flex w-full max-md:max-w-full" />
          <Header />
          <SearchBar />
        </div>
        <main className="bg-white self-center min-h-[878px] w-[1644px] max-w-full pt-10 px-8 max-md:px-5">
          <div className="h-[800px] w-full max-md:max-w-full">
            <div className="flex min-h-[857px] w-full gap-8 max-md:max-w-full">
              <section className="bg-white flex min-w-60 w-[1580px] flex-col overflow-hidden items-center pt-8 pb-[368px] px-20 max-md:pb-[100px] max-md:px-5">
                <div className="w-[788px] max-w-full">
                  <ContentEditor onSave={onSave} isLoading={isLoading} error={error} />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateArticle;
