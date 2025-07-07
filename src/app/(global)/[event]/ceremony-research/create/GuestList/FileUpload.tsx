'use client';

import React, { useState, useCallback } from "react";
import { Loader } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import Image from "next/image";

interface FileUploadProps {
  onImageUploaded?: (url: string) => void;
  onUploadComplete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onImageUploaded, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { edgestore } = useEdgeStore();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging],
  );

  const uploadFile = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
      });
      
      onImageUploaded?.(res.url);
      setIsUploading(false);
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  }, [edgestore.publicFiles, onImageUploaded, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.type.startsWith('image/')) {
        setFiles([file]);
        uploadFile(file);
      }
    }
  }, [uploadFile]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.type.startsWith('image/')) {
          setFiles([file]);
          uploadFile(file);
        }
      }
    },
    [uploadFile],
  );

  const getFileName = () => {
    if (files.length > 0) {
      return files[0].name;
    }
    return "theprojetks-design-tokens.jpg";
  };

  return (
    <div className="bg-[#FFDEE2] w-full rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
      <div 
        className="flex flex-col items-center justify-center py-32 px-[280px] relative max-md:px-6 max-md:py-16"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
         <div className="absolute top-3 left-3 bg-black/20 flex items-center gap-1.5 text-sm text-white font-medium p-2 rounded-lg">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/1aac0f4523378544a2742d77c6b3d046db9cdb04"
            alt="User avatar"
            width={20}
            height={20}
            className="aspect-[1] object-contain self-stretch shrink-0 my-auto rounded-[50%]"
          />
          <span className="self-stretch my-auto">Chanuka Saranga</span>
        </div>

        {isUploading ? (
          <div className="flex flex-col items-center space-y-6 w-full">
            <div className="animate-spin text-[#FF33A0]">
              <Loader size={48} className="text-[#FF33A0]" />
            </div>
            <div className="text-center">
              <p className="text-base font-normal text-gray-700 mb-1 font-['Inter'] leading-[14px]">
                Loading... {uploadProgress}%
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
              isDragging ? "scale-105 bg-[#FFBBCB]" : ""
            }`}
          >
            {isDragging ? (
              <div className={`flex items-center justify-center bg-[#D10562] rounded-lg py-6 px-8`}>
                <Image
                  src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743372305/marrygold/User_Rounded_o0ei6b.png"
                  alt="User icon"
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-2"
                />
                <span className="font-['Inter'] font-semibold text-white">
                  {getFileName()}
                </span>
              </div>
            ) : (
              <>
                <Image
                  src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743371866/marrygold/upload_irnsej.png"
                  alt="Upload icon"
                  width={42}
                  height={42}
                  className="w-[42px] h-[42px] object-contain mb-3 transition-transform hover:scale-110 duration-300"
                />
                
                <p className="font-['Inter'] text-[14px] leading-[20px] text-[#252525] font-normal mb-3">
                  Drag your file(s) to start uploading
                </p>
                
                <div className="flex items-center w-full justify-center gap-3 mb-2">
                  <div className="w-[80px] h-[1px] bg-[#E7E7E7]"></div>
                  <span className="font-['Secondary'] text-[12px] leading-[18px] text-[#888888]">OR</span>
                  <div className="w-[80px] h-[1px] bg-[#E7E7E7]"></div>
                </div>
                
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <div className="bg-[#D10562] hover:bg-[#C10452] transition-colors text-white font-['Inter'] font-semibold px-6 py-3 rounded-lg flex items-center justify-center">
                      Browse files
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileInput}
                      />
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
