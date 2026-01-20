import React from "react";

interface SectionPlaceholderProps {
  height: string;
}

const SectionPlaceholder: React.FC<SectionPlaceholderProps> = ({ height }) => {
  return (
    <div
      style={{ height }}
      className="w-full bg-ui-bg/30 backdrop-blur-sm border-b border-ui-border/50 flex items-center justify-center"
    >
      <div className="w-2 h-2 bg-brand-300 rounded-full animate-pulse" />
    </div>
  );
};

export default SectionPlaceholder;
