"use client";

import { useGlobalStore } from "@/app/store/global";
import { DbIcon, USBIcon } from "../icons";
import { MenuItem } from "../ui/menu";
import { useCallback, useEffect } from "react";

const menus = [
  {
    title: "存储池",
    icon: <DbIcon />,
    filename: 1,
    children: [
      {
        title: "私人影音",
        filename: "test",
      },
    ],
  },
  {
    title: "USB存储",
    icon: <USBIcon />,
    filename: 2,
    children: [
      {
        title: "debin",
        filename: "test2",
      },
    ],
  },
];

function Menu() {
  const { folderPaths, updateFolderPaths } = useGlobalStore(
    (state) => state
  );

  const currentMenu = folderPaths[0] || menus[0]?.children?.[0];

  useEffect(() => {
    if (!folderPaths.length) {
      updateFolderPaths([menus[0]?.children?.[0]]);
    }
  }, []);

  const changeMenu = useCallback((menu) => {
    if (menu.children) return;

    updateFolderPaths([menu]);
  }, []);

  const renderMenu = (menus, level = 0) => {
    return menus.map((menu, index) => (
      <>
        <MenuItem
          key={menu.filename + index}
          className={`${menu.children ? "" : "isLeaf"} ${
            menu.filename === currentMenu?.filename ? "active-menu" : ""
          }`}
          level={level}
          onClick={() => changeMenu(menu)}
        >
          <span>{menu.icon}</span>
          <span>{menu.title}</span>
        </MenuItem>
        {menu.children ? renderMenu(menu.children, level + 1) : null}
      </>
    ));
  };

  return (
    <div className="min-h-full w-[208px] pt-[4px] pr-[8px] pb-[4px] pl-[8px] shadow-[0_2px_5px_0_rgba(0,0,0,0.08)] border-[1px] border-[#e5e6eb] border-solid">
      {renderMenu(menus)}
    </div>
  );
}

export default Menu;
