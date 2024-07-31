import * as React from "react";
const PreIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    className="icon"
    viewBox="0 0 1024 1024"
    fill={props.currentColor}
    {...props}
  >
    <path d="m319.64 512.016 336.016-336.008 45.248 45.248L364.896 557.28z" />
    <path d="m365.216 466.464 339.976 339.968-45.256 45.256L319.96 511.712z" />
  </svg>
);
export default PreIcon;
