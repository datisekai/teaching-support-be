import bcrypt = require("bcryptjs");
import { encode, decode } from "js-base64";
import fs from "fs";
import path from "path";
import { getPublicDir } from "../app.config";
export const randomNumber = (count: number) => {
  let result = "";
  for (let i = 0; i < count; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit;
  }
  return parseInt(result);
};

export function toSlug(str: string) {
  str = str.toLowerCase();
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
  str = str.replace(/(đ)/g, "d");
  str = str.replace(/([^0-9a-z-\s])/g, "");
  str = str.replace(/(\s+)/g, "-");
  str = str.replace(/^-+/g, "");
  str = str.replace(/-+$/g, "");
  return str;
}

export function passwordHash(pwd: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(salt + pwd, 10);
  return {
    salt,
    hash,
  };
}

export function passwordCompare(password: string, salt: string, hash: string) {
  return bcrypt.compareSync(salt + password, hash);
}

export function normalize(str: string) {
  if (!str) {
    return "";
  }
  const VIETNAMESE_MAP: any = {
    á: "a",
    à: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ẵ: "a",
    ặ: "a",
    ẳ: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ẫ: "a",
    ẩ: "a",
    ậ: "a",
    đ: "d",
    é: "e",
    è: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    í: "i",
    ì: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ỏ: "o",
    ó: "o",
    õ: "o",
    ọ: "o",
    ò: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ữ: "u",
    ử: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    Á: "A",
    À: "A",
    Ả: "A",
    Ã: "A",
    Ạ: "A",
    Ă: "A",
    Ắ: "A",
    Ằ: "A",
    Ẵ: "A",
    Ặ: "A",
    Ẳ: "A",
    Â: "A",
    Ấ: "A",
    Ầ: "A",
    Ẫ: "A",
    Ẩ: "A",
    Ậ: "A",
    Đ: "D",
    É: "E",
    È: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ẹ: "E",
    Ê: "E",
    Ế: "E",
    Ề: "E",
    Ể: "E",
    Ễ: "E",
    Ệ: "E",
    Í: "I",
    Ì: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ị: "I",
    Ô: "O",
    Ố: "O",
    Ồ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ộ: "O",
    Ơ: "O",
    Ớ: "O",
    Ờ: "O",
    Ở: "O",
    Ỡ: "O",
    Ợ: "O",
    Ù: "U",
    Ú: "U",
    Ủ: "U",
    Ũ: "U",
    Ụ: "U",
    Ư: "U",
    Ứ: "U",
    Ừ: "U",
    Ữ: "U",
    Ử: "U",
    Ự: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Ỵ: "Y",
  };
  return str.replace(/[^A-Za-z0-9\[\] ]/g, (x) => {
    return VIETNAMESE_MAP[x] || x;
  });
}

export function randomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function encodeBase64(str: string) {
  return encode(encode(str));
}

export function decodeBase64(str: string) {
  return decode(decode(str));
}

export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

export function saveBase64Image(base64String: string, fileName: string) {
  console.log("base64String", base64String);
  const base64Real = `data:image/png;base64,${base64String}`;
  // Tách tiền tố data URL (data:image/jpeg;base64, hoặc tương tự)
  const matches = base64Real.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) {
    console.log("called");
    throw new Error("Invalid base64 format");
  }

  const ext = matches[1]; // Lấy phần mở rộng từ base64 (ví dụ: png, jpg)
  const data = matches[2]; // Lấy dữ liệu base64

  // Đường dẫn lưu file trong thư mục public/images
  const publicDir = getPublicDir();
  const filePath = path.join(publicDir, "images", `${fileName}.${ext}`);

  // Kiểm tra và tạo thư mục project/public/images nếu chưa tồn tại
  if (!fs.existsSync(path.join(publicDir, "images"))) {
    fs.mkdirSync(path.join(publicDir, "images"), {
      recursive: true,
    });
  }
  // Ghi file vào thư mục public/images
  fs.writeFileSync(filePath, data, "base64");

  console.log(`Image saved successfully to ${filePath}`);

  const fileNameReturn = `public/images/${fileName}.${ext}`;

  return fileNameReturn;
}

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export function calculateDuration(startDate: string, endDate?: string): number {
  const startDateTime = new Date(startDate).getTime(); // Convert start_date to timestamp
  const currentTime = endDate
    ? new Date(endDate).getTime()
    : new Date().getTime();

  const duration = currentTime - startDateTime; // Duration in milliseconds

  return duration; // This is the duration in milliseconds
}
