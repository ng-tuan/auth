import multer from 'multer';
import path from 'path';

export function renameImage(file: Express.Multer.File): string {
  const extension = path.extname(file.originalname).toLowerCase();
  const formattedDate = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  const newFileName = `${formattedDate}_${randomNumber}${extension}`;
  const newFilePath = path.join(path.dirname(file.originalname), newFileName);

  return newFilePath;
}

export function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Please input file is image type!'));
  }
}
