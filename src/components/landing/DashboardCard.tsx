import { EllipsisVerticalIcon } from "lucide-react"
interface DashboardCardProps {
    title: string
    subtitle: string
    imageSrc?: string;
    showDots?: boolean
    avatars?: boolean;
    tags?: Array<{name: string, color: string}>;
    onClick?: () => void;
  }
  
const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle,  showDots = false, avatars = false, tags = [], onClick }) => {
    return (
      <div
        id={title.replace(/\s+/g, "-").toLowerCase()}
        className="relative border border-[#E7E7E7] bg-white overflow-visible w-full h-full rounded-lg border-solid dashboard-card cursor-pointer hover:shadow-md transition-shadow"
       >
        <div className="flex flex-col h-full p-3 sm:p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[#252525] text-sm sm:text-base font-semibold">{title}</h3>
            <div className=" flex items-center">
          
              <EllipsisVerticalIcon className="w-5 h-5 text-[#333333]" />
            </div>
          </div>
          <p className="font-inter font-medium text-sm text-[#888888] text-[10px] sm:text-xs">{subtitle}</p>
          
          {avatars && (
            <div className="flex mt-4 sm:mt-6">
              <div className="flex -space-x-2">
                <img src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743278200/marrygold/Profile_r49sgv.png" className= "" alt="Guest avatar"  />
              </div>
            </div>
          )}
          
          {tags && tags.length > 0 && (
            <div className="flex mt-4 sm:mt-6">
              <img
              
                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743285465/image_4_bwgr5i.png" 
                alt="Event Tags" 
                className="h-6 w-auto"  
              />
            </div>
          )}
          
          <div className="mt-auto pt-3 sm:pt-4">
            <button className=" cursor-pointer w-full rounded-sm bg-white border py-2 sm:py-3 text-xs font-inter font-bold text-[#888888] border-gray-200 hover:bg-gray-50 transition-colors" onClick={onClick}>
              View All Details
            </button>
          </div>
        </div>
  
 
        {showDots && (
          <div
            id="connection-point"
            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-white border border-gray-400 z-50"
            style={{ 
              boxShadow: '0 0 3px rgba(0,0,0,0.2)'
            }}
          ></div>
        )}
      </div>
    )
}
  

export default DashboardCard