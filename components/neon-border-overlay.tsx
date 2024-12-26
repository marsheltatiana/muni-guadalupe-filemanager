interface NeonBorderOverlayProps {
  color?: string;
}

export const NeonBorderOverlay: React.FC<NeonBorderOverlayProps> = ({
  color = "#4D9FFF",
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {/* Corner wrapper */}
      <div className="absolute top-0 left-0 w-[30%] h-[30%]">
        {/* Top border with gradient */}
        <div
          className={`absolute top-0 left-[12px] right-0 h-[2px] bg-gradient-to-r from-[${color}] to-transparent`}
        />
        {/* Left border with gradient */}
        <div
          className={`absolute top-[12px] left-0 w-[2px] bottom-0 bg-gradient-to-b from-[${color}] to-transparent`}
        />
        {/* Corner arc */}
        <div className="absolute top-0 left-0 w-[12px] h-[12px] overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-[24px] h-[24px] border-[2px] border-[${color}] rounded-full`}
          />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-[12px] right-0 h-[2px] bg-gradient-to-r from-[${color}] to-transparent blur-[2px]`}
          />
          <div
            className={`absolute top-[12px] left-0 w-[2px] bottom-0 bg-gradient-to-b from-[${color}] to-transparent blur-[2px]`}
          />
          <div className="absolute top-0 left-0 w-[12px] h-[12px] overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-[24px] h-[24px] border-[2px] border-[${color}] rounded-full blur-[2px]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
