import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalStore } from "@/app/store/global";
import axios from "axios";
import { getFilePath } from "../../utils/tool";

const DropDownMenu = styled.div`
  position: absolute;
  box-sizing: border-box;
  padding: 4px 0;
  border: 1px solid rgb(229, 230, 235);
  border-radius: 4px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  width: 120px;
  right: 0;
  z-index: 99;

  .upload-action {
    line-height: 30px;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    width: 100%;
    text-align: center;

    &:hover {
      background-color: #f2f3f5;
    }

    span {
      cursor: pointer;
    }

    input {
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
`;

function Upload(props) {
  const [open, setOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  const {
    updateFiles,
    files,
    updateFileStatus,
    folderPaths,
    currentFolderIndex,
  } = useGlobalStore((state) => state);

  useEffect(() => {
    function handleChange() {
      setOpen(false);
    }
    if (open) {
      window.addEventListener("click", handleChange);
    } else {
      window.removeEventListener("click", handleChange);
    }
    return () => {
      window.removeEventListener("click", handleChange);
    };
  }, [open]);

  useEffect(() => {
    if (!props.children) {
      setOpen(false);
    }
  }, [props.children]);

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file,
      progress: 0,
      status: "pending",
    }));
    console.log("selectedFiles", selectedFiles);
    setOpen(false);
    updateFiles(selectedFiles);
  };

  const uploadFile = useCallback(
    (file, index) => {
      const formData = new FormData();
      const dev_name = folderPaths[0]?.filename;
      const _folderPaths = [...folderPaths];
      _folderPaths.splice(currentFolderIndex + 1);

      if (file.webkitRelativePath) {
        const newPath = file?.webkitRelativePath?.split("/");
        for (let i = 0; i < newPath.length - 1; i++) {
          _folderPaths.push({ filename: newPath[i] });
        }
      }

      const file_path = getFilePath([..._folderPaths], _folderPaths.length - 1, false);

      formData.append("field", file);
      formData.append("dev_name", dev_name);
      formData.append("file_path", file_path);

      axios
        .post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 通常不需要手动设置，axios 会自动设置
          },
          onUploadProgress: (progressEvent) => {
            // console.log(11, progressEvent);
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            updateFileStatus(index, "uploading", progress);
          },
        })
        .then(() => {
          updateFileStatus(index, "success", 100);
        })
        .catch(() => {
          updateFileStatus(index, "error");
        })
        .finally(() => {
          // 移除已上传文件
          setUploadQueue((queue) => queue.slice(1));
        });
    },
    [updateFileStatus, folderPaths, currentFolderIndex]
  );

  useEffect(() => {
    if (uploadQueue.length > 0) {
      const { file, index } = uploadQueue[0];
      uploadFile(file, index);
    }
  }, [uploadQueue, uploadFile]);

  useEffect(() => {
    const pendingFiles = files.filter((file) => file.status === "pending");
    if (pendingFiles.length > 0 && uploadQueue.length === 0) {
      const newQueue = pendingFiles.map((file, index) => ({
        file: file.file,
        index,
      }));
      setUploadQueue(newQueue);
    }
  }, [files, uploadQueue.length]);

  return (
    <div
      className={`w-full h-full relative ${props.classname}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      style={props.style}
    >
      {props.children}
      {open ? (
        <DropDownMenu onClick={(e) => e.stopPropagation()}>
          <div
            key={1}
            className={`flex items-center flex-col justify-center p-[6px] cursor-pointer text-[#4e5969]`}
          >
            <div className="upload-action">
              <span>上传文件</span>
              <input type="file" multiple onChange={handleFilesChange} />
            </div>
            <div className="upload-action">
              上传文件夹
              <input
                type="file"
                multiple
                webkitdirectory="true"
                onChange={handleFilesChange}
              />
            </div>
          </div>
        </DropDownMenu>
      ) : null}
    </div>
  );
}
export default Upload;
