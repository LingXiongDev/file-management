"use client";

import Header from "../components/header";
import Menu from "../components/menu";
import ToolBar from "../components/toolBar";
import NavBar from "../components/navBar";
import FileList from "./fileList";
import { useGlobalStore } from "@/app/store/global";
import { useCallback, useEffect } from "react";
import { GlobalProvider } from "../store/globalContext";
import { getFilePath } from "../utils/tool";
import { FileActionEnum } from "../utils/contants";
import request from "@/app/api";
import FileDetail from "../components/fileDetail";

function FileManagement() {
  const {
    currentFolderIndex,
    updateSelectList,
    updateSingleFile,
    updateNewData,
    updateMessageInfo,
    foldsAndFiles,
    folderPaths,
    updateFoldsAndFiles,
    updateViewFolds,
    selectList,
    singleFile,
  } = useGlobalStore((state) => state);

  useEffect(() => {
    updateSelectList([]);
    updateSingleFile({});
    updateNewData(undefined);
  }, [currentFolderIndex, updateSelectList]);

  const toDetail = (filename) => {
    if (filename) {
      const file = foldsAndFiles.find((f) => f.filename === filename);
      updateViewFolds(file);
    } else {
      const fileId = selectList[0];
      const file = foldsAndFiles.find((f) => f.filename === fileId);
      updateViewFolds(file);
    }
  };

  const changeAction = useCallback(
    (action, filename) => {
      console.log(action);
      if (action === FileActionEnum.ATTRIBUTES) {
        toDetail(filename);
      }
    },
    [toDetail]
  );

  const onSave = async (filename) => {
    if (!filename) return;
    if (!/^[^/?*:;{}\\]+$/.test(filename)) {
      // 提示不合法
      updateMessageInfo({
        open: true,
        content: "文件名不合法",
        type: "error",
      });
      return;
    }
    if (foldsAndFiles.some((f) => f.filename === filename)) {
      // 提示不能重名
      updateMessageInfo({
        open: true,
        content: "文件名不能重复",
        type: "error",
      });
      return;
    }

    const dev_name = folderPaths[0]?.filename;

    const _folderPaths = [...folderPaths];
    _folderPaths.splice(currentFolderIndex + 1);
    _folderPaths.push({ filename });

    const file_path = getFilePath(_folderPaths, currentFolderIndex + 1);

    // request
    return request
      .post("/api/saveFolds", { dev_name, file_path })
      .then(() => {
        updateNewData(undefined);
        updateFoldsAndFiles([...foldsAndFiles, { filename, is_dir: true }]);
      })
      .catch((err) => {
        console.log(err);
        updateMessageInfo({
          open: true,
          content: err?.response?.statusText || "服务器错误",
          type: "error",
        });
      });
  };

  return (
    <GlobalProvider value={{ changeAction, onSave }}>
      <div className="h-full w-full min-h-screen min-w-full flex flex-col">
        <Header />
        <div className="flex-1 h-full flex">
          <Menu />
          <div className="bg-[#f2f3f5] flex-1 overflow-y-auto flex flex-col">
            <ToolBar />
            <div className="bg-white flex-1 flex flex-col">
              <NavBar />
              <div className="flex-1 overflow-y-auto">
                <FileList />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FileDetail />
    </GlobalProvider>
  );
}

export default FileManagement;
