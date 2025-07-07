'use client';

import React, { useState, useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Block,  } from "@blocknote/core";
import { useEdgeStore } from "@/lib/edgestore";
import { FileUpload } from "./FileUpload";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

interface ContentEditorProps {
  onSave: (content: string, title: string, imageUrl?: string, publish?: boolean) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ onSave, isLoading, error }) => {
  const [showUpload, setShowUpload] = useState(true);
  const { edgestore } = useEdgeStore();
  const editorRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [coverImage, setCoverImage] = useState<string>();

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    });
    return res.url;
  };

  const editor = useCreateBlockNote({
    uploadFile: handleUpload,
    initialContent: [
      {
        type: "heading",
        content: [{
          type: "text",
          text: "Add Title",
          styles: {}
        }],
        props: {
          level: 1,
          textAlignment: "left"
        }
      },
      {
        type: "paragraph",
        content: [{
          type: "text",
          text: "Write Your Content Here....",
          styles: {}
        }],
        props: {
          textAlignment: "left"
        }
      }
    ],
    domAttributes: {
      editor: {
        class: "relative"
      }
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUploaded = (url: string) => {
    if (!mounted) return;
    setCoverImage(url);
    const imageBlock = {
      type: "image",
      props: {
        url,
        caption: "",
        textAlignment: "left"
      }
    } as Block;
    
    editor.insertBlocks([imageBlock], editor.topLevelBlocks[0], 'before');
  };

  const handleSave = async (publish = false) => {
    const blocks = editor.topLevelBlocks;
    const titleBlock = blocks.find(block => block.type === 'heading');
    const titleContent = titleBlock?.content?.[0];
    const title = titleContent?.type === 'text' ? titleContent.text : 'Untitled';
    
    const content = JSON.stringify(blocks);
    await onSave(content, title, coverImage, publish);
  };

  useEffect(() => {
    if (!mounted || !editorRef.current) return;

    const editorElement = editorRef.current as HTMLElement;
    const figures = editorElement.querySelectorAll('figure');

    figures.forEach(figure => {
      const toolbar = document.createElement('div');
      toolbar.className = 'image-toolbar';
      toolbar.addEventListener('click', () => setShowUpload(true));
      figure.appendChild(toolbar);
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newFigures = editorElement.querySelectorAll('figure:not(:has(.image-toolbar))');
          newFigures.forEach(figure => {
            const toolbar = document.createElement('div');
            toolbar.className = 'image-toolbar';
            toolbar.addEventListener('click', () => setShowUpload(true));
            figure.appendChild(toolbar);
          });
        }
      });
    });

    observer.observe(editorElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="w-full mt-8 space-y-8">
      {showUpload && (
        <FileUpload 
          onImageUploaded={handleImageUploaded}
          onUploadComplete={() => setShowUpload(false)}
        />
      )}
      <div className="w-full overflow-y-auto" ref={editorRef}>
        <style jsx global>{`
          .bn-container {
            min-height: calc(100vh - 200px);
            height: auto !important;
          }
          .bn-editor {
            font-size: 16px;
            padding: 2rem;
          }
          .bn-editor h1 {
            font-size: 40px;
            font-weight: 600;
            color: #252525;
          }
          .bn-editor h1:empty:before {
            content: 'Add Title';
            color: #CDCDCD;
          }
          .bn-editor p:empty:before {
            content: 'Write Your Content Here....';
            color: #CDCDCD;
          }
          .bn-editor figure {
            position: relative;
          }
          .bn-editor figure img {
            border-radius: 8px;
          }
          .bn-editor figure:hover .image-toolbar {
            opacity: 1;
          }
          .image-toolbar {
            position: absolute;
            top: 1rem;
            right: 1rem;
            opacity: 0;
            transition: opacity 0.2s;
            display: flex;
            gap: 8px;
            z-index: 10;
            background: white;
            border: 1px solid #E7E7E7;
            padding: 17.5px 12px;
            border-radius: 8px;
            font-family: 'Inter';
            font-weight: 600;
            font-size: 14px;
            color: #252525;
            cursor: pointer;
          }
          .image-toolbar:hover {
            background: #F8F8F8;
          }
          .image-toolbar:before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            background: url('https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743518203/Pen_2_cppzzi.png') no-repeat center;
            background-size: contain;
            vertical-align: middle;
          }
          .image-toolbar:after {
            content: 'Change Image';
          }
        `}</style>
        <BlockNoteView
          editor={editor}
          theme="light"
          editable={mounted}
          slashMenu={false}
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => handleSave(false)}
          disabled={isLoading}
          className="bg-white text-[#252525] border border-[#E7E7E7] px-6 py-4 rounded-lg font-semibold text-sm hover:bg-[#F8F8F8]"
        >
          {isLoading ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={isLoading}
          className="bg-[#252525] text-white px-6 py-4 rounded-lg font-semibold text-sm hover:bg-[#363636]"
        >
          {isLoading ? "Publishing..." : "Publish"}
        </button>
      </div>
      {error && (
        <div className="text-red-500 mt-4">{error}</div>
      )}
    </div>
  );
};
