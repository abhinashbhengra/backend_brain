import { supportedMimes } from "../config/filesystem.js";
import { v4 as uuid } from "uuid";

export const imageValidator = (size, mime) => {
  if (!supportedMimes.includes(mime)) {
    return "Image must be png,jpg,jpeg,svg,gif,webp";
  } else if (bytesToMb(size) > 2) {
    return "Image size must be less than 2 MB";
  }

  return null;
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const generateUniqueId = () => {
  return uuid();
};
