 ;
import Image from "next/image";
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="self-stretch w-full max-md:max-w-full">
      <div className="bg-purple-50 flex w-full items-stretch gap-5 overflow-hidden flex-wrap justify-between px-10 py-4 max-md:max-w-full max-md:px-5">
        <div className="text-black text-[19px] font-bold tracking-[2.85px] uppercase my-auto">
          logo
        </div>
        <div className="flex items-center gap-[40px_48px] text-base text-[rgba(30,30,30,1)] font-semibold tracking-[-0.3px] flex-wrap max-md:max-w-full">
          <div className="self-stretch flex items-center gap-2 my-auto">
            <Image
              width={20}
              height={20}
              src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/8bce6667257bd987512c426326a3f68766634fab?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto rounded-[5px]"
              alt="Ceremony list icon"
            />
            <div className="self-stretch my-auto">Ceremony List</div>
          </div>
          <div className="self-stretch flex items-center gap-2 whitespace-nowrap my-auto">
            <Image
              width={20}
              height={20}
              src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/50c2bed6329ff070b4b4adcc524b08f70c3d5104?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Share icon"
            />
            <div className="self-stretch my-auto">Share</div>
          </div>
          <div className="self-stretch flex items-center gap-2 whitespace-nowrap my-auto">
            <Image
              width={20}
              height={20}
              src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/9bc2592c26afd3708c710dd747a28ddcb6752496?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
              alt="Support icon"
            />
            <div className="self-stretch my-auto">Support</div>
          </div>
          <Image
            width={34}
            height={34}
            src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/865696331986b05e011e914819023cacb4578f55?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[34px] self-stretch shrink-0 my-auto rounded-[50%]"
            alt="User profile"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
