export const FileActionEnum = {
  RENAME: "rename",
  COPY: "copy",
  REMOVE: "remove",
  ATTRIBUTES: "attributes",
  DELETE: "delete",
  DOWNLOAD: "download",
  UPLOAD: "upload",
};

export const SortActionEnum = {
  NAME: "name",
  DETE: "date",
  SIZE: "size",
};

export const ModeEnum = {
  LIST: "list",
  THUMBNAIL: "thumbnail",
};

export const ActionEnum = {
  COPY: "copy",
  REMOVE: "remove",
};

export const ActionText = {
  [ActionEnum.COPY]: "拷贝到",
  [ActionEnum.REMOVE]: "移动到",
};

export const DefaultFilesList = [
  {
    title: "私人影音",
    filename: "test",
    is_dir: true,
  },
  {
    title: "debin",
    filename: "test2",
    is_dir: true,
  },
];
