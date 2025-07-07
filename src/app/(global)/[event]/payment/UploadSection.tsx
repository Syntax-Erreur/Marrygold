'use client'
import Image from "next/image";
import React, { useState } from "react";

const UploadSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
    const files = e.dataTransfer.files;
    console.log("Files dropped:", files);
  };

  return (
    <div className="bg-white flex w-full flex-col overflow-hidden items-stretch justify-center px-[79px] py-[33px] rounded-xl max-md:max-w-full max-md:px-5">
      <div
        className={`flex min-h-[232px] flex-col items-stretch justify-center px-6 py-[41px] rounded-lg max-md:max-w-full max-md:px-5 ${isDragging ? "bg-gray-50 border-2 border-dashed border-[rgba(209,5,98,1)]" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex w-full flex-col items-stretch max-md:max-w-full">
          <Image
            width={42}
            height={42}
            src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/0f69e208b10ac42957740b386409774bc9a559d6?placeholderIfAbsent=true"
            alt="Upload Icon"
            className="aspect-[1] object-contain w-[42px] self-center"
          />
          <div className="flex w-full flex-col items-center mt-3 max-md:max-w-full">
            <div className="self-stretch w-full gap-1 text-sm text-[rgba(37,37,37,1)] text-center leading-none max-md:max-w-full">
              Drag your file(s) to start uploading
            </div>
            <div className="flex w-[201px] max-w-full items-center gap-3 text-[#888] whitespace-nowrap text-center tracking-[0px] mt-2">
              <div className="bg-[rgba(231,231,231,1)] self-stretch flex w-20 shrink h-0 flex-1 basis-[0%] my-auto" />
              <div className="self-stretch my-auto">OR</div>
              <div className="bg-[rgba(231,231,231,1)] self-stretch flex w-20 shrink h-0 flex-1 basis-[0%] my-auto" />
            </div>
            <div className="flex text-[rgba(209,5,98,1)] font-semibold mt-2">
              <button className="self-stretch bg-[rgba(246,246,246,1)] border min-h-[42px] gap-2 p-3 rounded-lg border-[rgba(209,5,98,1)] border-solid">
                Create Payment Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;