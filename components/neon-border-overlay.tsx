import { cn } from "@/lib/utils";

interface NeonBorderOverlayProps {
  className?: string;
}

export const NeonBorderOverlay: React.FC<NeonBorderOverlayProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden rounded-lg",
        className
      )}
    >
      {/* Corner wrapper */}
      <div className="absolute top-0 left-0 w-[30%] h-[30%]">
        {/* Top border with gradient */}
        <div
          className={`absolute top-0 left-[12px] right-0 h-[2px] bg-gradient-to-r from-[#4D9FFF] to-transparent`}
        />
        {/* Left border with gradient */}
        <div
          className={`absolute top-[12px] left-0 w-[2px] bottom-0 bg-gradient-to-b from-[#4D9FFF] to-transparent`}
        />
        {/* Corner arc */}
        <div className="absolute top-0 left-0 w-[12px] h-[12px] overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-[24px] h-[24px] border-[2px] border-[#4D9FFF] rounded-full`}
          />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-[12px] right-0 h-[2px] bg-gradient-to-r from-[#4D9FFF] to-transparent blur-[2px]`}
          />
          <div
            className={`absolute top-[12px] left-0 w-[2px] bottom-0 bg-gradient-to-b from-[#4D9FFF] to-transparent blur-[2px]`}
          />
          <div className="absolute top-0 left-0 w-[12px] h-[12px] overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-[24px] h-[24px] border-[2px] border-[#4D9FFF] rounded-full blur-[2px]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
