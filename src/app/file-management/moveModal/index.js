import { useMoveOrCopyStore } from "@/app/store/moveOrCopy";
import styled from "styled-components";
import { ActionText, DefaultFilesList, ActionEnum } from "../../utils/contants";
import {
  getType,
  getFilePath,
  generateDefaultFolderName,
  getFileName,
} from "../../utils/tool";
import { UiButton } from "@/app/components/ui/button";
import { UiLoading } from "@/app/components/ui/loading";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FileIcon,
  FilesIcon,
  PngIcon,
  PDFIcon,
  PPTIcon,
  WordIcon,
  ZipIcon,
  ExcelIcon,
  CloseIcon,
  ConfirmIcon,
  LineIcon,
} from "../../components/icons";
import request from "@/app/api";
import { useGlobalStore } from "@/app/store/global";

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
    text-align: left;
  }

  .arco-modal-content {
    position: relative;
    padding: 12px 20px;
    color: rgb(29, 33, 41);
    font-size: 14px;
  }

  .arco-modal-footer {
    border-top: 1px solid rgb(229, 230, 235);
    width: 100%;
    box-sizing: border-box;
    text-align: right;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
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

  .create-file {
    font-size: 14px;
    line-height: 1.5;
    color: rgb(99, 125, 255);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .button-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-cancel {
    background-color: rgb(242, 243, 245);
    color: rgb(78, 89, 105);
    border: 1px solid transparent;
  }

  .btn-primary {
    background-color: rgb(22, 93, 255);
    color: #fff;
    border: 1px solid transparent;
  }
`;

const FileItemWrapperV2 = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;

  .row {
    display: flex;
    width: 100%;
    align-items: center;
    min-height: 42px;
    border-radius: 4px;

    &:hover {
      background: rgba(132, 133, 141, 0.08);
    }
  }

  .checkbox {
    width: 42px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px 0px 0px 0px;
  }

  .file-icon {
    width: 42px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-name {
    display: flex;
    align-items: center;
    flex: 1;
    height: 100%;

    input {
      height: 24px;
      line-height: 24px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 100%;
      outline: 0;
      padding: 0 12px;
      color: #03081a;
      display: inline-block;
      font-size: inherit;
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;

      &:hover {
        border-color: #06a7ff;
      }
    }
  }

  .file-date {
    width: 120px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .file-size {
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: 0px 5px 0px 0px;
  }

  .header-row {
    color: #fff;
    height: 42px;

    .checkbox,
    .file-icon,
    .file-name,
    .file-date,
    .file-size {
      background: #0492f2;
    }
  }
`;

const BreadcrumbItem = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  vertical-align: middle;
  line-height: 32px;
  color: rgb(78, 89, 105);
  cursor: pointer;

  &:hover {
    color: rgb(99, 125, 255);
  }
`;

const BreadcrumbItemSeparator = styled.span`
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
  line-height: 32px;
  color: rgb(201, 205, 212);
`;

export const Breadcrumb = () => {
  const {
    folderPaths,
    currentFolderIndex,
    updateFolderPaths,
    updateFolderIndex,
  } = useMoveOrCopyStore((state) => state);

  console.log(folderPaths);

  const breadcrumbs = useMemo(() => {
    const allFile = [
      {
        label: "全部文件",
        index: -1,
      },
    ];
    if (folderPaths?.length === 0) return allFile;
    return [
      ...allFile,
      ...folderPaths.map((f, index) => ({
        label: index === 0 ? f.title || f.filename : f.filename,
        index,
      })),
    ];
  }, [folderPaths, currentFolderIndex]);

  return (
    <div>
      <>
        {breadcrumbs.map((b, i) => {
          if (i === breadcrumbs.length - 1) {
            return (
              <BreadcrumbItem
                style={{ color: "#1d2129", fontWeight: 500, cursor: "default" }}
              >
                {b.label}
              </BreadcrumbItem>
            );
          }
          return (
            <>
              <BreadcrumbItem
                onClick={() => {
                  updateFolderIndex(b.index);
                  if (b.index === -1) {
                    updateFolderPaths(DefaultFilesList);
                  } else {
                    updateFolderPaths(folderPaths.slice(0, b.index + 1));
                  }
                }}
              >
                {b.label}
              </BreadcrumbItem>
              <BreadcrumbItemSeparator>
                <LineIcon />
              </BreadcrumbItemSeparator>
            </>
          );
        })}
      </>
    </div>
  );
};

export const FileItem = React.memo((props) => {
  const { currentFolderIndex } = useMoveOrCopyStore((state) => state);

  const { data, icon, onDoubleClick, handleSave, onClose, loading } = props;

  const { filename, isCreate, title } = data || {};

  const ref = useRef(null);

  const onSave = () => {
    if (loading) return;
    const filename = ref.current?.value;
    handleSave(filename);
  };

  const value = currentFolderIndex == -1 ? title : filename;

  return (
    <div className="row" onDoubleClick={onDoubleClick}>
      <div className="file-icon">{icon}</div>
      <div className="file-name">
        {!isCreate ? (
          value
        ) : (
          <div className="flex items-center gap-[6px]">
            <input
              style={{ width: "100%" }}
              autoFocus
              defaultValue={value}
              ref={ref}
            />
            <div className="bg-white flex items-center gap-[6px]">
              <div className="p-[3px]" onClick={onSave}>
                <ConfirmIcon />
              </div>
              <div className="p-[3px]" onClick={onClose}>
                <CloseIcon />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export const CommonFileItem = React.memo((props) => {
  const { filename, is_dir, isCreate } = props;
  const {
    folderPaths,
    currentFolderIndex,
    updateFolderPaths,
    updateFolderIndex,
    foldsAndFiles,
    updateNewData,
    updateFoldsAndFiles,
  } = useMoveOrCopyStore((state) => state);
  const { updateMessageInfo } = useGlobalStore((state) => state);

  const [loading, setLoading] = useState(false);

  const icon = useMemo(() => {
    if (is_dir) return <FilesIcon />;
    const type = getType(filename);

    switch (type) {
      case "png":
      case "jpg":
      case "jpeg":
        return <PngIcon />;
      case "pdf":
        return <PDFIcon />;
      case "ppt":
        return <PPTIcon />;
      case "word":
        return <WordIcon />;
      case "zip":
        return <ZipIcon />;
      case "xls":
      case "xlsx":
        return <ExcelIcon />;
      default:
        return <FileIcon />;
    }
  }, [is_dir, filename]);

  const onDoubleClick = () => {
    if (!is_dir) return;
    const _folderPaths = [...folderPaths];

    const disabledNext =
      folderPaths.length === 0 || currentFolderIndex === folderPaths.length - 1;

    if (disabledNext) {
      _folderPaths.push(props);
    } else {
      _folderPaths.splice(currentFolderIndex + 1);
      _folderPaths.push(props);
    }

    updateFolderPaths(_folderPaths);
    updateFolderIndex(currentFolderIndex + 1);
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
    if (
      foldsAndFiles.filter((d) => d.is_dir).some((f) => f.filename === filename)
    ) {
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
      .then((res) => {

        if (res.code !== 2000) {
          updateMessageInfo({
            open: true,
            content: res.msg || "服务器错误",
            type: "error",
          });
          return;
        }
        updateNewData(undefined);
        updateFoldsAndFiles([{ filename, is_dir: true }, ...foldsAndFiles]);
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

  const handleSave = (filename) => {
    if (loading) return;

    setLoading(true);
    onSave(filename).finally(() => {
      setLoading(false);
    });
  };

  const onClose = () => {
    if (loading) return;
    if (isCreate) {
      updateNewData(undefined);
    }
  };

  return (
    <FileItem
      data={props}
      icon={icon}
      onDoubleClick={onDoubleClick}
      handleSave={handleSave}
      onClose={onClose}
      loading={loading}
    />
  );
});

function MoveOrCopyModal() {
  const {
    visibled,
    action,
    foldsAndFiles,
    currentFolderIndex,
    newData,
    folderPaths,
    updateFoldsAndFiles,
    updateVisibled,
    updateNewData,
    actionFiles,
  } = useMoveOrCopyStore((state) => state);

  const {
    updateMessageInfo,
    updateFoldsAndFiles: updateGlobalFoldsAndFiles,
    foldsAndFiles: globalFoldsAndFiles,
    updateSelectList,
    selectList,
  } = useGlobalStore((state) => state);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [currentFoldId, dev_name, file_path] = useMemo(() => {
    const dev_name = folderPaths[0]?.filename;
    const file_path = getFilePath(folderPaths, currentFolderIndex);

    return [folderPaths[currentFolderIndex], dev_name, file_path];
  }, [folderPaths, currentFolderIndex]);

  const getFiles = async () => {
    setLoading(true);
    // request
    request
      .get("/api/getAllFs", { dev_name, file_path })
      .then((res) => {
        updateFoldsAndFiles(res.data);
      })
      .catch((err) => {
        console.log(err);
        updateMessageInfo({
          open: true,
          content: err?.response?.statusText || "服务器错误",
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAction = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    const dest_path = getFilePath(folderPaths, currentFolderIndex, false);

    const body = actionFiles.map((a) => ({
      ...a,
      dest_path:
        currentFolderIndex !== 0
          ? `${dest_path}/${getFileName(a.src_path)}`
          : `/${getFileName(a.src_path)}`,
    }));

    let url = "";
    if (action === ActionEnum.COPY) {
      url = "/api/copyFiles";
    } else if (action === ActionEnum.REMOVE) {
      url = "/api/moveFiles";
    }
    if (!url) return;
    request
      .put(url, body)
      .then(() => {
        // 从全局的里面排出
        const actions = body.map((item) => {
          const parts = item.src_path.split("/");
          return parts[parts.length - 1];
        });

        if (action === ActionEnum.REMOVE) {
          const _foldsAndFiles = globalFoldsAndFiles.filter(
            (f) => !actions.includes(f.filename)
          );

          updateGlobalFoldsAndFiles(_foldsAndFiles);
          // 排出 selectList 中旧的名字
          const _selectList = selectList.filter((n) => !actions.includes(n));
          updateSelectList(_selectList);
        }

        updateVisibled(false);
      })
      .catch((err) => {
        console.log(err);
        updateMessageInfo({
          open: true,
          content: err?.response?.statusText || "服务器错误",
          type: "error",
        });
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  useEffect(() => {
    if (dev_name && file_path) {
      getFiles();
    }
  }, [currentFoldId, dev_name, file_path]);

  const renderFiles = useMemo(() => {
    const data = newData ? [newData, ...foldsAndFiles] : foldsAndFiles;
    return data.filter((d) => d.is_dir);
  }, [foldsAndFiles, newData]);

  return visibled ? (
    <FileDetailWrapper>
      <div className="mark"></div>
      <div className="body">
        <div className="arco-modal-header">
          <div className="arco-modal-title" id="arco-dialog-6">
            {ActionText[action]}
          </div>
        </div>
        <div className="arco-modal-content">
          <Breadcrumb />
          <div className="flex-1 overflow-y-auto" style={{ height: 388 }}>
            <div className="h-full flex flex-wrap items-center content-start">
              {loading ? (
                <div className="w-full flex items-center justify-center h-full">
                  <UiLoading />
                </div>
              ) : renderFiles.length === 0 ? (
                <div className="w-full h-full flex justify-center mt-[52px] text-[#4e5969]">
                  该目录下没有文件夹
                </div>
              ) : (
                <>
                  <FileItemWrapperV2>
                    {renderFiles.map((f, index) => (
                      <CommonFileItem key={index} {...f} />
                    ))}
                  </FileItemWrapperV2>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className="arco-modal-footer"
          style={{
            justifyContent:
              currentFolderIndex === -1 ? "flex-end" : "space-between",
          }}
        >
          {currentFolderIndex !== -1 && (
            <span
              className="create-file"
              onClick={() => {
                updateNewData({
                  filename: generateDefaultFolderName(
                    foldsAndFiles?.map((f) => f.filename) || []
                  ),
                  is_dir: true,
                  isCreate: true,
                });
              }}
            >
              新建文件夹
            </span>
          )}
          <div className="button-wrapper">
            <UiButton
              onClick={() => {
                updateVisibled(false);
              }}
              className="btn-cancel"
            >
              取消
            </UiButton>
            {currentFolderIndex !== -1 && (
              <UiButton className="btn-primary" onClick={handleAction}>
                {ActionText[action]}此处
              </UiButton>
            )}
          </div>
        </div>
        <span
          className="arco-icon-hover arco-modal-close-icon"
          tabindex="-1"
          role="button"
          aria-label="Close"
          onClick={() => {
            updateVisibled(false);
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

export default MoveOrCopyModal;
