"use client";
import { useMemo } from "react";
import { useGlobalStore } from "@/app/store/global";
import { PreIcon, NextIcon, MoreIcon } from "../icons";
import { UiButton } from "../ui/button";
import DropDown from "../ui/dropDown";
import { FileActionEnum } from "../../utils/contants";
import { useGlobalContext } from "../../store/globalContext";
import { generateDefaultFolderName } from "../../utils/tool";

function ToolBar() {
  const {
    folderPaths,
    updateFolderIndex,
    currentFolderIndex,
    selectList,
    updateNewData,
    foldsAndFiles,
  } = useGlobalStore((state) => state);

  const { changeAction } = useGlobalContext();

  const disabledPre = currentFolderIndex === 0;
  const disabledNext =
    folderPaths.length === 0 || currentFolderIndex === folderPaths.length - 1;

  const checkedNull = selectList.length === 0;
  const isOnlyOne = selectList.length === 1;

  const changeIndex = (sign) => {
    if (!sign) return;
    if (sign > 0) {
      updateFolderIndex(
        Math.max(currentFolderIndex + sign, folderPaths.length - 1)
      );
    } else if (sign < 0) {
      updateFolderIndex(Math.min(currentFolderIndex + sign, 0));
    }
  };

  const menus = useMemo(() => {
    return [
      {
        label: "重命名",
        value: FileActionEnum.RENAME,
        disabled: checkedNull || !isOnlyOne,
      },
      {
        label: "拷贝",
        value: FileActionEnum.COPY,
        disabled: checkedNull,
      },
      {
        label: "移动",
        value: FileActionEnum.REMOVE,
        disabled: checkedNull,
      },
      {
        label: "属性",
        value: FileActionEnum.ATTRIBUTES,
        disabled: checkedNull || !isOnlyOne,
      },
    ];
  }, [checkedNull, isOnlyOne]);

  return (
    <div className="flex items-center justify-between p-[8px]">
      <div className="flex items-center justify-between gap-[6px] pl-[8px] pr-[8px]">
        <span
          className={`w-[24px] h-[24px] cursor-pointer flex items-center justify-center rounded-[2px] ${
            disabledPre ? "cursor-default opacity-[0.3]" : "hover:bg-slate-300"
          }`}
          onClick={() => {
            if (disabledPre) return;
            changeIndex(-1);
          }}
        >
          <PreIcon />
        </span>
        <span
          className={`w-[24px] h-[24px] cursor-pointer flex items-center justify-center rounded-[2px] ${
            disabledNext ? "cursor-default opacity-[0.3]" : "hover:bg-slate-300"
          }`}
          onClick={() => {
            if (disabledNext) return;
            changeIndex(1);
          }}
        >
          <NextIcon />
        </span>
      </div>
      <div className="flex items-center gap-[16px] pr-[8px]">
        <UiButton
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
        </UiButton>
        <UiButton>上传</UiButton>
        <UiButton
          disabled={checkedNull}
          onClick={() => {
            if (checkedNull) return;
            changeAction(FileActionEnum.DOWNLOAD);
          }}
        >
          下载
        </UiButton>
        <UiButton
          disabled={checkedNull}
          onClick={() => {
            if (checkedNull) return;
            changeAction(FileActionEnum.DELETE);
          }}
        >
          删除
        </UiButton>
        <DropDown menus={menus} onClick={changeAction}>
          <UiButton
            className="flex items-center justify-center"
            style={{ display: "flex" }}
          >
            <MoreIcon />
          </UiButton>
        </DropDown>
      </div>
    </div>
  );
}

export default ToolBar;
