import { Request, Response } from 'express';
import multer from 'multer';
import {
  APP_DOMAIN,
  FILE_STORAGE_LOCATION,
  StatusCode,
} from '../enum/AppConst';
import Image, { ImageCreationAttributes } from '../models/Images';
import { checkFileType, renameImage } from '../utils/fileUtil';

const storage = multer.diskStorage({
  destination: FILE_STORAGE_LOCATION,
  filename: (req, file, cb) => {
    cb(null, renameImage(file));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 102400000 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    checkFileType(file, cb);
  },
}).single('image');

const uploadImage = async (req: Request, res: Response) => {
  upload(req, res, err => {
    if (err) {
      res.status(StatusCode.ERROR).json({ message: err.message });
    } else {
      if (req.file == undefined) {
        res.status(StatusCode.ERROR).json({ message: 'No file selected!' });
      } else {
        try {
          const domain = APP_DOMAIN;
          const imagePathWithDomain = `${domain}/${renameImage(req.file)}`;
          const image: ImageCreationAttributes = {
            image_name: req.file.filename,
            path: imagePathWithDomain,
          };

          Image.create(image);
          res
            .status(StatusCode.SUCCESS)
            .json({ message: 'File uploaded and saved to database!' });
        } catch (error) {
          res
            .status(StatusCode.INTERNAL_SERVER)
            .json({ message: 'Database error', error: error });
        }
      }
    }
  });
};

export { uploadImage };
