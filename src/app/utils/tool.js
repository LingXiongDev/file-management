import dayjs from "dayjs";

export const getFilePath = (paths = [], index = 1, encode = true) => {
  let path = "";

  for (let i = 1; i <= index; i++) {
    if (paths[i]?.filename) {
      path += "/" + paths[i]?.filename;
    }
  }

  if (!path) {
    path = "/";
  }

  return encode ? encodeURIComponent(path) : path;
};

export const getType = (filename) => {
  const data = filename.split(".");
  return (data[data.length - 1] || "")?.toLocaleLowerCase();
};

// 按文件名排序
export function sortByFilename(files) {
  return files.slice().sort((a, b) => a.filename.localeCompare(b.filename));
}

// 按创建时间排序
export function sortByCreateTime(files) {
  return files
    .slice()
    .sort((a, b) =>
      dayjs(a.create_time).isBefore(dayjs(b.create_time)) ? -1 : 1
    );
}

// 按文件大小排序
export function sortBySize(files) {
  return files.slice().sort((a, b) => a.size_kb - b.size_kb);
}

export function formatFileSize(sizeKb) {
  if (sizeKb < 1024) {
    // 小于1MB
    return `${sizeKb}KB`;
  } else if (sizeKb < 1024 * 1024) {
    // 小于1GB
    return `${(sizeKb / 1024).toFixed(1)}MB`;
  } else {
    // 大于或等于1GB
    return `${(sizeKb / (1024 * 1024)).toFixed(1)}GB`;
  }
}

export function generateDefaultFolderName(existingNames) {
  const baseName = "未命名文件夹";
  let newName = baseName;
  let counter = 1;

  while (existingNames.includes(newName)) {
    newName = `${baseName} (${counter})`;
    counter += 1;
  }

  return newName;
}

export function getFileName(path) {
  if (!path) return '';
  const parts = path.split("/");
  return parts[parts.length - 1];
}
