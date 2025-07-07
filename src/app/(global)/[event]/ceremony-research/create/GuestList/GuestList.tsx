import React from "react";
import  Header  from "./Header";
import { FileUpload } from "./FileUpload";
import { ContentEditor } from "./ContentEditor";
import { blogService } from "@/lib/firebase/blog-service";
import { useParams } from "next/navigation";

const GuestList: React.FC = () => {
  const { event } = useParams();

  const handleSave = async (content: string, title: string, imageUrl?: string) => {
    const eventSlug = decodeURIComponent(String(event));
    await blogService.createPost(eventSlug, {
      title,
      content,
      imageUrl,
      isPublished: false,
      eventSlug
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex min-h-[1213px] w-full flex-col items-stretch max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="bg-white flex min-h-7 w-full max-md:max-w-full" />
          <Header />
        </div>
        <main className="bg-white self-center min-h-[878px] w-[1644px] max-w-full pt-10 px-8 max-md:px-5">
          <div className="h-[800px] w-full max-md:max-w-full">
            <div className="flex min-h-[857px] w-full gap-8 max-md:max-w-full">
              <section className="bg-white flex min-w-60 w-[1580px] flex-col overflow-hidden items-center pt-8 pb-[368px] px-20 max-md:pb-[100px] max-md:px-5">
                <div className="w-[788px] max-w-full">
                  <FileUpload />
                  <ContentEditor onSave={handleSave} />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuestList;
