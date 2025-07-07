'use client';

import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import SidebarArticle from "./SidebarArticle";
import { blogService, BlogPost } from "@/lib/firebase/blog-service";

interface MainLayoutProps {
  contents?: BlogPost[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ contents }) => {
  const [mainArticles, setMainArticles] = useState<BlogPost[]>([]);
  const [sidebarArticles, setSidebarArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        // If contents are provided, use them directly
        if (contents) {
          const sortedArticles = [...contents].sort((a, b) => 
            (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
          );

          setMainArticles(sortedArticles.slice(0, 4));
          setSidebarArticles(sortedArticles.slice(4, 12));
          setIsLoading(false);
          return;
        }

         const articles = await blogService.getAllPosts("", true);
        
         const sortedArticles = articles.sort((a, b) => {
          return (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0);
        });

         setMainArticles(sortedArticles.slice(0, 4));
        setSidebarArticles(sortedArticles.slice(4, 12));
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [contents]);

  const getContentPreview = (content: string) => {
    try {
      const parsedContent = JSON.parse(content);
       const paragraphBlock = parsedContent.find((block: any) => 
        block.type === "paragraph" && 
        block.content?.[0]?.text
      );
      return paragraphBlock?.content?.[0]?.text?.slice(0, 150) + "..." || "";
    } catch (e) {
      return content.slice(0, 150) + "...";
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getImageUrl = (article: BlogPost): string | undefined => {
     if (article.imageUrl) {
      return article.imageUrl;
    }

     try {
      const parsedContent = JSON.parse(article.content);
      const imageBlock = parsedContent.find((block: any) => 
        block.type === "image" && 
        block.props?.url
      );
      return imageBlock?.props?.url;
    } catch (e) {
      console.error("Error parsing content for image:", e);
      return undefined;
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 py-8 bg-white rounded-xl">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-8 bg-white rounded-xl">
        <div className="flex flex-col gap-4">
          <div className="text-red-500 font-medium">Error loading articles:</div>
          <div className="text-gray-700">{error}</div>
          {error.includes('requires a Firestore index') && (
            <div className="flex flex-col gap-2">
              <div className="text-gray-700">To fix this:</div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click the link above to open Firebase Console</li>
                <li>Sign in if necessary</li>
                <li>Click &quot;Create Index&quot; to create the required index</li>
                <li>Wait a few minutes for the index to be created</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 bg-white rounded-xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {mainArticles.slice(0, 2).map((article) => (
              <ArticleCard
                key={article.id}
                imageUrl={getImageUrl(article)}
                date={formatDate(article.publishedAt || article.createdAt)}
                category="Research"
                title={article.title}
                content={getContentPreview(article.content)}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainArticles.slice(2, 4).map((article) => (
              <ArticleCard
                key={article.id}
                imageUrl={getImageUrl(article)}
                date={formatDate(article.publishedAt || article.createdAt)}
                category="Research"
                title={article.title}
                content={getContentPreview(article.content)}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 space-y-3">
          {sidebarArticles.map((article) => (
            <SidebarArticle
              key={article.id}
              date={formatDate(article.publishedAt || article.createdAt)}
              category="Research"
              title={article.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
