'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface ContentEditorProps {
  onSave: (content: string, title: string, publish?: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function ContentEditor({ onSave, isLoading, error }: ContentEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (publish: boolean) => {
    await onSave(content, title, publish);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 text-2xl font-bold border-none outline-none bg-transparent"
        />
      </div>
      
      <div className="min-h-[400px]">
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full min-h-[400px] p-4 border-none outline-none bg-transparent resize-none"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isLoading || !title || !content}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={isLoading || !title || !content}
        >
          Publish
        </Button>
      </div>
    </div>
  );
} 