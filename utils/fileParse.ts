// Get file icon based on file type
export const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase();

  if (type.startsWith("image/")) {
    return "i-lucide-image";
  } else if (type.startsWith("video/")) {
    return "i-lucide-video";
  } else if (type.startsWith("audio/")) {
    return "i-lucide-music";
  } else if (type.includes("pdf")) {
    return "i-lucide-file-text";
  } else if (type.includes("word") || type.includes("document")) {
    return "i-lucide-file-text";
  } else if (type.includes("excel") || type.includes("spreadsheet")) {
    return "i-lucide-table";
  } else if (type.includes("powerpoint") || type.includes("presentation")) {
    return "i-lucide-presentation";
  } else if (type.includes("zip") || type.includes("archive")) {
    return "i-lucide-archive";
  } else {
    return "i-lucide-file";
  }
};

// Extract filename from URL
export const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("-").pop() || "file";
    const utf8Filename = decodeURIComponent(filename);

    // If filename is too long, truncate it
    if (utf8Filename.length > 40) {
      const extension = utf8Filename.split(".").pop();
      const nameWithoutExt = utf8Filename.substring(0, 15);
      return `${nameWithoutExt}...${extension ? "." + extension : ""}`;
    }

    return utf8Filename;
  } catch {
    return "file";
  }
};
