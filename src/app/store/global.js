import { create } from 'zustand'
import { ModeEnum, SortActionEnum } from '../utils/contants'

export const useGlobalStore = create((set) => ({
    // 当前选中的文件夹索引
    currentFolderIndex: 0,
    // 文件夹记录
    folderPaths: [],
    // 模式
    mode: ModeEnum.THUMBNAIL,
    /** 排序规则 */
    sortField: SortActionEnum.NAME,
    /** 文件列表 */
    foldsAndFiles: [],
    /** 选中的列表 */
    selectList: [],
    /** 文件缓存 */
    filesCache: new Map(),
    /** 单个文件邮件操作 */
    singleFile: {},
    /** 新增文件 */
    newData: undefined,
    /** 全局提示 */
    messageInfo: {},
    // 更新当前选中的文件夹
    updateFolderPaths: (folderPaths) => set(() => ({ folderPaths })),
    /** 更新当前文件夹索引 */
    updateFolderIndex: (currentFolderIndex) => set(() => ({ currentFolderIndex })),
    /** 改变文件显示模式 */
    updateMode: (mode) => set(() => ({ mode })),
    /** 更新排序规则 */
    updateSortField: (sortField) => set(() => ({ sortField })),
    /** 更新文件列表 */
    updateFoldsAndFiles: (foldsAndFiles) => set(() => ({ foldsAndFiles })),
    /** 更新选中的列表 */
    updateSelectList: (selectList) => set(() => ({ selectList })),
    /** 更新文件缓存 */
    updateFilesCache: (filesCache) => set(() => ({ filesCache })),
    /** 更新单个文件邮件操作 */
    updateSingleFile: (singleFile) => set(() => ({ singleFile })),
    /** 新增文件 */
    updateNewData: (newData) => set(() => ({ newData })),
    /** 新增文件 */
    updateMessageInfo: (messageInfo) => set(() => ({ messageInfo })),
}))