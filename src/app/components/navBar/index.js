"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { CheckIcon, LineIcon, ListIcon, ThumbnailIcon } from "../icons";
import DropDown from "../ui/dropDown";
import { SortActionEnum, ModeEnum } from "../../utils/contants";
import { RaduisButton } from "../ui/button";
import CheckBox from "../ui/checkBox";
import { useGlobalStore } from "@/app/store/global";

const BreadcrumbItem = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  vertical-align: middle;
  line-height: 32px;
  color: rgb(78, 89, 105);
`;

const BreadcrumbItemSeparator = styled.span`
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
  line-height: 32px;
  color: rgb(201, 205, 212);
`;

const Text = styled.span`
  font-size: 14px;
  height: 32px;
  color: rgb(78, 89, 105);
  line-height: 32px;
`;

function NavBar() {
  const {
    mode,
    updateMode,
    sortField,
    updateSortField,
    folderPaths,
    currentFolderIndex,
    selectList,
    foldsAndFiles,
    updateSelectList,
  } = useGlobalStore((state) => state);

  const allChecked =
    foldsAndFiles.length !== 0 && foldsAndFiles.length === selectList.length;
  const indeterminate = !allChecked && selectList.length > 0;

  const menus = useMemo(() => {
    return [
      {
        label: "名称",
        value: SortActionEnum.NAME,
        disabled: false,
      },
      {
        label: "文件时间",
        value: SortActionEnum.DETE,
        disabled: false,
      },
      {
        label: "文件大小",
        value: SortActionEnum.SIZE,
        disabled: false,
      },
    ];
  }, []);

  const breadcrumbs = useMemo(() => {
    if (folderPaths?.length === 0) return [];
    const first = folderPaths[0];
    const currentFolds = folderPaths[currentFolderIndex];
    if (currentFolderIndex === 0) return [first.title, "全部文件"];
    return [first.title, currentFolds.filename];
  }, [folderPaths, currentFolderIndex]);

  const sortName = menus.find((m) => m.value === sortField)?.label || "名称";

  const changeAction = (value) => {
    updateSortField(value);
  };

  const handleSelect = (allChecked) => {
    if (allChecked) {
      // 取消全选
      updateSelectList([]);
    } else {
      // 全选
      updateSelectList(foldsAndFiles.map((f) => f.filename));
    }
  };

  return (
    <div className="p-[8px] flex items-center justify-between">
      <div
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
        title={`${breadcrumbs[0]} / ${breadcrumbs[1]}`}
      >
        <BreadcrumbItem>{breadcrumbs[0]}</BreadcrumbItem>
        <BreadcrumbItemSeparator>
          <LineIcon />
        </BreadcrumbItemSeparator>
        <BreadcrumbItem style={{ color: "#1d2129", fontWeight: 500 }}>
          {breadcrumbs[1]}
        </BreadcrumbItem>
      </div>
      <div className="flex items-center gap-[8px] w-[300px] ml-[12px] justify-end">
        <DropDown
          menus={menus}
          onClick={changeAction}
          style={{ width: "auto" }}
          value={sortField}
        >
          <RaduisButton>按{sortName}</RaduisButton>
        </DropDown>
        <div className="flex items-center gap-[4px]">
          <Text>已选择</Text>
          <Text>{selectList.length}</Text>
          <Text className="flex items-center justify-center w-[32px]">
            <CheckBox
              allChecked={allChecked}
              indeterminate={indeterminate}
              onClick={handleSelect}
            />
          </Text>
        </div>
        <RaduisButton
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <span className="icon" onClick={() => updateMode(ModeEnum.LIST)}>
            {mode === ModeEnum.LIST ? <CheckIcon /> : null}
            <ListIcon />
          </span>
          <span className="line"></span>
          <span className="icon" onClick={() => updateMode(ModeEnum.THUMBNAIL)}>
            {mode === ModeEnum.THUMBNAIL ? <CheckIcon /> : null}
            <ThumbnailIcon />
          </span>
        </RaduisButton>
      </div>
    </div>
  );
}

export default NavBar;
