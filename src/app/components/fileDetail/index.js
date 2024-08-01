import { useGlobalStore } from "@/app/store/global";
import styled from "styled-components";
import { formatFileSize } from "../../utils/tool";
import dayjs from "dayjs";

const FileDetailWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  .mark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(29, 33, 41, 0.6);
  }

  .body {
    position: relative;
    top: 100px;
    margin: 0 auto;
    // left: 50%;
    width: 520px;
    // height: 100px;
    // transform: translate(-50%, -50%);
    border-radius: 4px;
    border: 0 solid rgb(229, 230, 235);
    background-color: #fff;
    line-height: 1.5715;
    text-align: left;
    white-space: normal;
    box-shadow: none;
    box-sizing: border-box;
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
    text-align: center;
  }

  .arco-modal-content {
    position: relative;
    padding: 24px 20px;
    color: rgb(29, 33, 41);
    font-size: 14px;
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
`;

function FileDetail() {
  const { viewFolds, updateViewFolds } = useGlobalStore((state) => state);

  return viewFolds ? (
    <FileDetailWrapper>
      <div className="mark"></div>
      <div className="body">
        <div class="arco-modal-header">
          <div class="arco-modal-title" id="arco-dialog-6">
            {viewFolds?.filename}
          </div>
        </div>
        <div className="arco-modal-content">
          <div className="mb-[8px] font-[600]">详细信息</div>
          <div className="text-[12px] text-[#4e5969] mt-[6px] mb-[6px]">
            文件名
          </div>
          <div>{viewFolds?.filename}</div>
          <div className="text-[12px] text-[#4e5969] mt-[6px] mb-[6px]">
            文件大小
          </div>
          <div>{formatFileSize(viewFolds?.size_kb || 0)}</div>
          <div className="text-[12px] text-[#4e5969] mt-[6px] mb-[6px]">
            创建时间
          </div>
          <div>
            {dayjs(viewFolds?.create_time).format("YYYY-MM-DD hh:mm:ss")}
          </div>
        </div>
        <span
          className="arco-icon-hover arco-modal-close-icon"
          tabindex="-1"
          role="button"
          aria-label="Close"
          onClick={() => {
            updateViewFolds(undefined);
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
}

export default FileDetail;
