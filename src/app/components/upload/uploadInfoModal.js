import { useGlobalStore } from "@/app/store/global";
import styled from "styled-components";
import { formatFileSize } from "../../utils/tool";
import { useEffect, useRef, useState } from "react";
import { SuccessIcon, ErrorIcon } from "@/app/components/icons";

const FileDetailWrapper = styled.div`
  position: fixed;

  right: 20px;
  bottom: 20px;
  z-index: 9;

  .body {
    margin: 0 auto;
    width: 375px;
    max-height: 530px;
    min-height: 54px;
    border-radius: 4px;
    border: 0 solid rgb(229, 230, 235);
    background-color: #fff;
    line-height: 1.5715;
    text-align: left;
    white-space: normal;
    box-shadow: none;
    box-sizing: border-box;
    box-shadow: 0 0 1px 1px rgba(28, 28, 32, 0.05),
      0 8px 24px rgba(28, 28, 32, 0.12);
    border-radius: 5px;
    -webkit-transition: max-height 0.66s cubic-bezier(0.66, 0, 0.01, 1);
    transition: max-height 0.66s cubic-bezier(0.66, 0, 0.01, 1);
    overflow: hidden;
  }

  .arco-modal-header {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    border-bottom: 1px solid rgb(229, 230, 235);
    height: 48px;
    display: flex;
    align-items: center;
  }

  .arco-modal-title {
    color: rgb(29, 33, 41);
    font-size: 16px;
    font-weight: 500;
    flex: 1;
    text-align: left;
  }

  .arco-modal-content {
    position: relative;
    // padding: 24px 20px;
    color: rgb(29, 33, 41);
    font-size: 14px;
    height: 464px;
    width: 375px;
    overflow: auto;
  }

  .arco-modal-close-icon {
    position: absolute;
    right: 20px;
    top: 18px;
    font-size: 12px;
    cursor: pointer;
    color: rgb(29, 33, 41);
    display: inline-block;
  }

  .arco-icon-hover:before {
    content: "";
    position: absolute;
    display: block;
    border-radius: 50%;
    background-color: transparent;
    box-sizing: border-box;
    transition: background-color 0.1s linear;
    top: 50%;
    left: 50%;
    height: 20px;
    width: 20px;
    transform: translate(-50%, -50%);
  }

  .arco-icon-hover .arco-icon {
    position: relative;
    vertical-align: -0.09em;
  }

  .arco-icon[stroke="currentColor"] {
    stroke: currentColor;
    fill: none;
  }

  .arco-icon {
    display: inline-block;
    color: inherit;
    font-style: normal;
    width: 1em;
    height: 1em;
  }

  .arco-icon-hover:hover:before {
    background-color: rgb(242, 243, 245);
  }

  .task {
    padding: 12px 16px;
    justify-content: space-between;
    position: relative;
    // padding: 14px 18px 14px 16px;
    // height: 64px;
    width: 100%;
    display: flex;
    align-items: center;

    .task-info-wrapper {
      display: flex;
      align-items: center;
    }

    .task-file-name {
      font-size: 14px;
      line-height: 1.5;
      width: 200px;
      display: inline-block;
      color: rgb(37, 38, 43);
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .task-desc {
      font-size: 12px;
      line-height: 1.6;
      color: rgba(37, 38, 43, 0.36);
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
    }

    .progress {
      width: calc(100% - 32px);
      position: absolute;
      bottom: 0px;
      height: 2px;
      background-color: rgba(37, 38, 43, 0.36);
      border-radius: 4px;
    }

    .progress-inner {
      width: 0;
      background-color: rgb(0, 180, 42);
      height: 100%;
    }
  }
`;

export const UiLoading = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  border: 2px solid #000;
  border-top-color: rgba(0, 0, 0, 0.2);
  border-right-color: rgba(0, 0, 0, 0.2);
  border-bottom-color: rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  animation: circle infinite 0.75s linear;

  @keyframes circle {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const icon = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
};

const UploadInfoModal = () => {
  const { files } = useGlobalStore((state) => state);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      setOpen(true);
    }
  }, [files]);

  const remainingFiles = files.filter(
    (file) => file.status === "pending" || file.status === "uploading"
  );

  const completedFiles = files.filter(
    (file) => file.status === "success" || file.status === "error"
  );

  return open ? (
    <FileDetailWrapper>
      <div className="body">
        <div class="arco-modal-header">
          <div class="arco-modal-title" id="arco-dialog-6">
            <span className="icon"></span>
            <span className="text-[14px] text-[#25262b] font-[500]">
              {remainingFiles.length > 0 ? `上传中` : "上传完成"}
            </span>
            <span style={{ padding: "0 7px" }}>·</span>
            <span className="text-[14px] text-[#25262b] font-[400]">
              {remainingFiles.length > 0
                ? `剩余 ${remainingFiles.length} 项`
                : `共 ${completedFiles.length} 项`}
            </span>
          </div>
        </div>
        <div className="arco-modal-content">
          {files.map((fileWithStatus, index) => {
            return (
              <div key={index} className="task">
                <div className="task-info-wrapper">
                  <span className="task-file-name">
                    {fileWithStatus.file.name}
                  </span>
                  <span className="task-desc">
                    {formatFileSize(fileWithStatus.file.size / 1000)}
                  </span>
                </div>
                {fileWithStatus.status === "pending" ||
                fileWithStatus.status === "uploading" ? (
                  <UiLoading />
                ) : (
                  icon[fileWithStatus.status]
                )}
                {fileWithStatus.status === "pending" ||
                fileWithStatus.status == "uploading" ? (
                  <div className="progress">
                    <div
                      className="progress-inner"
                      style={{ width: `${fileWithStatus.progress}%` }}
                    ></div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <span
          className="arco-icon-hover arco-modal-close-icon"
          tabindex="-1"
          role="button"
          aria-label="Close"
          onClick={() => {
            setOpen(false);
          }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            viewBox="0 0 48 48"
            aria-hidden="true"
            focusable="false"
            className="arco-icon arco-icon-close"
          >
            <path d="M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142"></path>
          </svg>
        </span>
      </div>
    </FileDetailWrapper>
  ) : null;
};

export default UploadInfoModal;
