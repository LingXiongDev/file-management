import * as React from "react";

const DbIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    className="icon"
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path
      fill="gray"
      d="M44.8 168.96v683.52c0 106.24 229.12 161.92 455.04 161.92s455.04-55.68 455.04-161.92V168.96c0-212.48-910.08-212.48-910.08 0zm455.04-99.2c256 0 392.32 64 392.32 99.2S753.92 268.8 499.84 268.8s-392.32-64-392.32-99.2S246.4 69.76 499.84 69.76zm0 881.92c-256 0-392.32-64-392.32-99.2V710.4a853.12 853.12 0 0 0 392.32 76.16 853.12 853.12 0 0 0 392.32-76.16v142.08c0 33.92-138.24 99.2-392.32 99.2zm0-228.48c-256 0-392.32-64-392.32-99.2V478.08a853.12 853.12 0 0 0 392.32 76.16 853.12 853.12 0 0 0 392.32-76.16V624c0 33.92-138.24 99.84-392.32 99.84zm0-232.32c-256 0-392.32-64-392.32-99.2V256a853.76 853.76 0 0 0 392.32 74.88A853.76 853.76 0 0 0 892.16 256v135.68c0 33.92-138.24 99.84-392.32 99.84z"
    />
  </svg>
);

export default DbIcon;