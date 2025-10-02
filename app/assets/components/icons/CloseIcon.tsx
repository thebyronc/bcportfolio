import React from "react";

interface CloseIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({ size = 24, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="18" x2="18" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CloseIcon;
