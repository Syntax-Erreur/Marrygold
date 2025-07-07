import React from "react";
import Image from "next/image";

interface SidebarArticleProps {
  date: string;
  category: string;
  title: string;
}

const SidebarArticle: React.FC<SidebarArticleProps> = ({
  date,
  category,
  title,
}) => {
  return (
    <div className="flex px-3 py-4 gap-4 bg-[#f8f8f8] rounded-xl">
      <Image
        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743327788/marrygold/Rectangle_177_gxnhvc.png"
        className="w-[125.71px] h-[80px] object-cover rounded-lg shrink-0"
        alt={title}
        width={126}
        height={80}
      />
      <div>
        <div className="flex items-center gap-6 text-base text-[#888888] font-normal">
          <span>{date}</span>
          <span>{category}</span>
        </div>
        <h4 className="text-base font-extrabold text-[#252525] mt-6 line-clamp-2">
          {title}
        </h4>
      </div>
    </div>
  );
};

export default SidebarArticle;
