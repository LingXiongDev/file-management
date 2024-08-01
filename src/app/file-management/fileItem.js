"use client";

import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  FileIcon,
  FilesIcon,
  PngIcon,
  PDFIcon,
  PPTIcon,
  WordIcon,
  ZipIcon,
  ExcelIcon,
  MoreIcon,
  CloseIcon,
  ConfirmIcon,
} from "../components/icons";
import { getType, formatFileSize } from "../utils/tool";
import dayjs from "dayjs";
import { useGlobalStore } from "@/app/store/global";
import CheckBox from "../components/ui/checkBox";
import DropDown from "../components/ui/dropDown";
import { FileActionEnum, ModeEnum } from "../utils/contants";
import { useGlobalContext } from "../store/globalContext";

const FileItemContainer = styled.div`
  margin: 0 0 24px 32px;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;

  .action {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .checkbox,
  .more {
    display: none;
  }

  &:hover {
    background-color: #f7f9fc;

    .checkbox,
    .more {
      display: block;
    }
  }

  &.is-checked,
  &.is-create {
    background-color: #f2faff;
    .checkbox,
    .more {
      display: block;
    }
  }
`;

const FileItemWrapper = styled.div`
  width: 120px;
  padding: 2px 8px 0;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 24px;

  .file-icon {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 60px;
      height: 60px;
    }
  }

  .file-name {
    line-height: 18px;
    font-size: 12px;
    margin-top: 8px;
    color: #03081a;
    overflow: hidden;
    max-height: 36px;
    word-break: break-all;
    max-width: 100%;
    width: 100%;
    text-align: center;

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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #818999;
    line-height: 18px;
    margin-top: 2px;
  }
`;

const FileItemWrapperV2 = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;

  .row {
    display: flex;
    width: 100%;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    align-items: center;
    min-height: 42px;
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

export const CommonFileItem = React.memo((props) => {
  const { onSave, onEditSave } = useGlobalContext();

  const { filename, is_dir, isCreate, isEdit } = props;
  const {
    folderPaths,
    currentFolderIndex,
    updateFolderPaths,
    updateFolderIndex,
    selectList = [],
    updateSelectList,
    updateSingleFile,
    updateNewData,
    mode,
    foldsAndFiles,
    updateFoldsAndFiles,
  } = useGlobalStore((state) => state);

  const [loading, setLoading] = useState(false);

  const allChecked = selectList.includes(filename);

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
    updateSingleFile({});
  };

  const handleSelect = () => {
    if (allChecked) {
      updateSelectList(selectList.filter((it) => it !== filename));
    } else {
      updateSelectList([...selectList, filename]);
    }
  };

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

  const handleSave = (filename) => {
    if (loading) return;

    setLoading(true);
    if (!isEdit) {
      onSave(filename).finally(() => {
        setLoading(false);
      });
    } else {
      onEditSave(filename).finally(() => {
        setLoading(false);
      });
    }
  };

  const onClose = () => {
    if (loading) return;
    if (isCreate) {
      updateNewData(undefined);
    }
    if (isEdit) {
      // 找到对应项，变成false
      const _foldsAndFiles = foldsAndFiles.map((f) => ({ ...f, isEdit: false }));
      updateFoldsAndFiles(_foldsAndFiles);
    }
  };

  return mode === ModeEnum.THUMBNAIL ? (
    <FileItem
      allChecked={allChecked}
      data={props}
      menus={menus}
      icon={icon}
      onDoubleClick={onDoubleClick}
      handleSave={handleSave}
      onClose={onClose}
      handleSelect={handleSelect}
      loading={loading}
    />
  ) : (
    <FileItemV2
      allChecked={allChecked}
      data={props}
      menus={menus}
      icon={icon}
      onDoubleClick={onDoubleClick}
      handleSave={handleSave}
      onClose={onClose}
      handleSelect={handleSelect}
      loading={loading}
    />
  );
});

export const FileItem = React.memo((props) => {
  const { changeAction } = useGlobalContext();
  const { updateSingleFile } = useGlobalStore();

  const {
    data,
    allChecked,
    menus,
    icon,
    onDoubleClick,
    handleSave,
    onClose,
    handleSelect,
    loading,
  } = props;

  const { create_time, filename, is_dir, isCreate, isEdit } = data || {};

  const ref = useRef(null);

  const onSave = () => {
    if (loading) return;
    const filename = ref.current?.value;
    handleSave(filename);
  };

  return (
    <FileItemContainer
      className={`${allChecked ? "is-checked " : ""} ${
        isCreate || isEdit ? "is-create" : ""
      }`}
    >
      <div className="action">
        <div className="checkbox">
          {!isCreate && !isEdit && (
            <CheckBox allChecked={allChecked} onClick={handleSelect} />
          )}
        </div>
        <div className="rigth">
          {!isCreate && !isEdit ? (
            <DropDown
              menus={menus}
              classname="more"
              onClick={(action) => {
                changeAction(action, filename);
              }}
            >
              <div className="more">
                <MoreIcon />
              </div>
            </DropDown>
          ) : (
            <div className="bg-white flex items-center gap-[6px]">
              <div className="p-[3px]" onClick={onSave}>
                <ConfirmIcon />
              </div>
              <div className="p-[3px]" onClick={onClose}>
                <CloseIcon />
              </div>
            </div>
          )}
        </div>
      </div>
      <FileItemWrapper onDoubleClick={onDoubleClick}>
        <div className="file-icon">{icon}</div>
        <div className="file-name">
          {!isCreate && !isEdit ? (
            filename
          ) : (
            <input
              style={{ width: "100%" }}
              autoFocus
              defaultValue={filename}
              ref={ref}
            />
          )}
        </div>
        <div className="file-date">
          {dayjs(create_time).format("YYYY-MM-DD")}
        </div>
      </FileItemWrapper>
    </FileItemContainer>
  );
});

export const FileList = (props) => {
  const { files = [] } = props;

  return (
    <FileItemWrapperV2>
      <div className="row header-row">
        <div className="checkbox"></div>
        <div className="file-icon"></div>
        <div className="file-name">名称</div>
        <div className="file-date">创建时间</div>
        <div className="file-size">大小</div>
      </div>
      <div
        className="overflow-y-auto w-full"
        style={{ height: "calc(100vh - 60px - 48px - 48px - 42px - 30px)" }}
      >
        {files.map((f, index) => (
          <CommonFileItem key={index} {...f} />
        ))}
      </div>
    </FileItemWrapperV2>
  );
};

export const FileItemV2 = React.memo((props) => {
  const {
    data,
    allChecked,
    icon,
    onDoubleClick,
    handleSave,
    onClose,
    handleSelect,
    loading,
  } = props;

  const {
    create_time,
    filename,
    is_dir,
    size_kb = 0,
    isCreate,
    isEdit,
  } = data || {};

  const { updateSingleFile } = useGlobalStore((state) => state);

  const ref = useRef(null);

  const onSave = () => {
    if (loading) return;
    const filename = ref.current?.value;
    handleSave(filename);
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    if (isCreate || isEdit) return;

    const {
      top = 0,
      left = 0,
      height = 0,
    } = e.target?.getBoundingClientRect() || {};

    updateSingleFile({
      filename,
      clientX: left,
      clientY: top + height / 2,
    });
  };

  return (
    <div
      className="row"
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div className="checkbox">
        {!isCreate && !isEdit && (
          <CheckBox allChecked={allChecked} onClick={handleSelect} />
        )}
      </div>
      <div className="file-icon">{icon}</div>
      <div className="file-name">
        {!isCreate && !isEdit ? (
          filename
        ) : (
          <div className="flex items-center gap-[6px]">
            <input
              style={{ width: "100%" }}
              autoFocus
              defaultValue={filename}
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
      <div className="file-date">{dayjs(create_time).format("YYYY-MM-DD")}</div>
      <div className="file-size">{formatFileSize(size_kb)}</div>
    </div>
  );
});
