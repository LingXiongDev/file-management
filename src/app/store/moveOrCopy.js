import { create } from "zustand";
import { ActionEnum, DefaultFilesList } from "../utils/contants"

export const useMoveOrCopyStore = create((set) => ({
  // 当前选中的文件夹索引
  currentFolderIndex: -1,
  // 文件夹记录
  folderPaths: [],
  // 模式
  action: undefined,
  // 显示隐藏
  visibled: false,
  /** 文件列表 */
  foldsAndFiles: DefaultFilesList,
  /** 新增文件 */
  newData: undefined,
  /**待移动、拷贝列表 */
  actionFiles: [],
  // 更新当前选中的文件夹
  updateFolderPaths: (folderPaths) => set(() => ({ folderPaths })),
  /** 更新当前文件夹索引 */
  updateFolderIndex: (currentFolderIndex) =>
    set(() => ({ currentFolderIndex })),
  /** 操作，复制或者移动 */
  updateAction: (action) => set(() => ({ action })),
  /** 更新排序规则 */
  updateSortField: (sortField) => set(() => ({ sortField })),
  /** 更新文件列表 */
  updateFoldsAndFiles: (foldsAndFiles) => set(() => ({ foldsAndFiles })),
  updateVisibled: (visibled) => set(() => ({ visibled })),
   /** 新增文件 */
   updateNewData: (newData) => set(() => ({ newData })),
   updateActionFiles: (actionFiles) => set(() => ({ actionFiles })),
}));
