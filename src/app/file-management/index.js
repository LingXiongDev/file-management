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
  } = useGlobalStore((state) => state);

  useEffect(() => {
    updateSelectList([]);
    updateSingleFile({});
    updateNewData(undefined);
  }, [currentFolderIndex, updateSelectList]);

  const toDetail = (filename) => {
    const fileId = filename || selectList[0];
    const file = foldsAndFiles.find((f) => f.filename === fileId);
    updateViewFolds(file);
  };

  const rename = (filename) => {
    const fileId = filename || selectList[0];
    const _foldsAndFiles = foldsAndFiles.map((f) => {
      if (f.filename === fileId) {
        return { ...f, isEdit: true };
      }
      return { ...f, isEdit: false };
    });
    updateFoldsAndFiles(_foldsAndFiles);
  };

  const deleteFn = (filename) => {
    const body = [];
    const dev_name = folderPaths[0]?.filename;

    const _folderPaths = [...folderPaths];
    _folderPaths.splice(currentFolderIndex + 1);

    if (filename) {
      // 单个删除
      const file_path = getFilePath(_folderPaths, currentFolderIndex + 1);
      body.push({
        dev_name,
        path: file_path,
      });
    } else {
      selectList.forEach((n) => {
        _folderPaths.push(n);
        const file_path = getFilePath(_folderPaths, currentFolderIndex + 1);
        body.push({
          dev_name,
          path: file_path,
        });
        _folderPaths.pop();
      });
    }

    return request
      .post("/api/deleteFolds", body)
      .then(() => {
        const delFiles = filename ? [filename] : selectList;

        const _foldsAndFiles = foldsAndFiles.filter(
          (f) => !delFiles.includes(f.filename)
        );
        updateFoldsAndFiles(_foldsAndFiles);
        // 排出 selectList 中旧的名字
        const _selectList = selectList.filter((n) => !delFiles.includes(n));
        updateSelectList(_selectList);
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

  const changeAction = useCallback(
    (action, filename) => {
      console.log(action);
      const fn = {
        [FileActionEnum.ATTRIBUTES]: toDetail,
        [FileActionEnum.RENAME]: rename,
        [FileActionEnum.DELETE]: deleteFn,
      };
      fn[action]?.(filename);
    },
    [toDetail, rename]
  );

  const onEditSave = async (filename) => {
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

    const editFile = foldsAndFiles.find((f) => f.isEdit);
    const checkFile = foldsAndFiles.find((f) => f.filename === filename);
    if (checkFile && !checkFile.isEdit) {
      // 提示不能重名
      updateMessageInfo({
        open: true,
        content: "文件名不能重复",
        type: "error",
      });
      return;
    } else if (checkFile && checkFile.isEdit) {
      // 自己编辑自己，没修改直接保存
      const _foldsAndFiles = foldsAndFiles.map((f) => {
        if (f.isEdit) {
          return { ...f, filename, isEdit: false };
        }
        return { ...f, isEdit: false };
      });
      updateFoldsAndFiles(_foldsAndFiles);
      return;
    }

    const dev_name = folderPaths[0]?.filename;

    const _folderPaths = [...folderPaths];
    _folderPaths.splice(currentFolderIndex + 1);
    editFile?.filename && _folderPaths.push({ filename: editFile?.filename });

    const file_path = getFilePath(_folderPaths, currentFolderIndex + 1);

    // request
    return request
      .put("/api/renameFolds", {
        dev_name,
        file_path,
        file_name: encodeURIComponent(filename),
      })
      .then(() => {
        const _foldsAndFiles = foldsAndFiles.map((f) => {
          if (f.isEdit) {
            return { ...f, filename, isEdit: false };
          }
          return { ...f, isEdit: false };
        });
        updateFoldsAndFiles(_foldsAndFiles);
        // 排出 selectList 中旧的名字
        const _selectList = selectList.filter((n) => n !== editFile?.filename);
        updateSelectList(_selectList);
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
    <GlobalProvider value={{ changeAction, onSave, onEditSave }}>
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
