import Image from "next/image";
import React from "react";

interface ArticleCardProps {
  imageUrl?: string;
  date: string;
  category: string;
  title: string;
  content: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  imageUrl,
  date,
  category,
  title,
  content,
}) => {
  return (
    <div className="bg-[#f8f8f8] p-4 rounded-xl">
      <div>
        {imageUrl && (
          <Image
            width={512}
            height={270}
            src={imageUrl}
            className="w-[512px] h-[270px] object-cover rounded-lg"
            alt={title}
          />
        )}
        <div className={imageUrl ? "mt-8" : ""}>
          <div className="flex items-center gap-4 text-base text-[#888888] font-normal">
            <div>{date}</div>
            <div>{category}</div>
          </div>
          <h3 className="text-xl font-extrabold text-[#252525] mt-6">{title}</h3>
          <p className="text-base font-medium text-[#888888] mt-3">{content}</p>
          <button className="bg-[#252525] text-white text-sm font-semibold px-[23.5px] py-[17.5px] rounded-lg mt-6">
            Read Full Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
