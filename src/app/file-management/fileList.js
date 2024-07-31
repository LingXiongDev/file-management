"use client";

import { useGlobalStore } from "@/app/store/global";
import { useEffect, useMemo, useState } from "react";
import { UiLoading } from "../components/ui/loading";
import request from "@/app/api";
import {
  getFilePath,
  sortByCreateTime,
  sortBySize,
  sortByFilename,
} from "@/app/utils/tool";
import { SortActionEnum, ModeEnum, FileActionEnum } from "@/app/utils/contants";
import { CommonFileItem, FileList as RenderFileList } from "./fileItem";
import FilePopover from "../components/ui/filePopover";
import { useGlobalContext } from "../store/globalContext";

function FileList() {
  const {
    folderPaths = [],
    currentFolderIndex,
    filesCache,
    foldsAndFiles,
    updateFoldsAndFiles,
    sortField,
    mode,
    singleFile = {},
    updateSingleFile,
    newData
  } = useGlobalStore((state) => state);
  const { changeAction } = useGlobalContext();

  const [loading, setLoading] = useState(true);

  const [currentFoldId, dev_name, file_path] = useMemo(() => {
    const dev_name = folderPaths[0]?.filename;
    const file_path = getFilePath(folderPaths, currentFolderIndex);

    return [folderPaths[currentFolderIndex], dev_name, file_path];
  }, [folderPaths, currentFolderIndex]);

  const getFiles = async () => {
    if (filesCache.has(currentFoldId)) return filesCache.get(currentFoldId);
    setLoading(true);
    // request
    request
      .get("/api/getAllFs", { dev_name, file_path })
      .then((res) => {
        updateFoldsAndFiles(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dev_name && file_path) {
      getFiles();
    }
  }, [currentFoldId, dev_name, file_path]);

  const sortFiles = useMemo(() => {
    if (foldsAndFiles.length === 0) return foldsAndFiles;

    if (sortField === SortActionEnum.DETE) {
      return sortByCreateTime(foldsAndFiles);
    } else if (sortField === SortActionEnum.SIZE) {
      return sortBySize(foldsAndFiles);
    }
    return sortByFilename(foldsAndFiles);
  }, [sortField, foldsAndFiles]);

  const renderFiles = useMemo(() => {
    return newData ? [newData, ...sortFiles] : sortFiles
  }, [sortFiles, newData])

  const menus = useMemo(() => {
    return [
      {
        label: "重命名",
        value: FileActionEnum.RENAME,
      },
      {
        label: "拷贝",
        value: FileActionEnum.COPY,
      },
      {
        label: "移动",
        value: FileActionEnum.REMOVE,
      },
      {
        label: "属性",
        value: FileActionEnum.ATTRIBUTES,
      },
      {
        label: "删除",
        value: FileActionEnum.DELETE,
      },
      {
        label: "下载",
        value: FileActionEnum.DOWNLOAD,
      },
    ];
  }, []);

  return (
    <div className="h-full p-[12px] flex flex-wrap items-center content-start">
      {loading ? (
        <div className="w-full flex items-center justify-center h-full">
          <UiLoading />
        </div>
      ) : renderFiles.length === 0 ? (
        <div className="w-full h-full flex justify-center mt-[52px] text-[#4e5969]">
          空文件夹
        </div>
      ) : (
        <>
          {mode === ModeEnum.THUMBNAIL ? (
            <div
              className="overflow-y-auto w-full flex flex-wrap content-start"
              style={{
                height: "calc(100vh - 60px - 48px - 48px - 30px)",
              }}
            >
              {renderFiles.map((f, index) => (
                <CommonFileItem key={index} {...f} />
              ))}
            </div>
          ) : (
            <RenderFileList files={renderFiles} />
          )}
        </>
      )}
      <FilePopover
        onClose={() => {
          updateSingleFile({});
        }}
        menus={menus}
        onClick={changeAction}
        {...singleFile}
      />
    </div>
  );
}

export default FileList;
