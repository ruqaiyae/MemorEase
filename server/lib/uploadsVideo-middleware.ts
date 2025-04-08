import path from 'node:path';
import multer from 'multer';

const videosDirectory = 'public/videos';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, videosDirectory);
  },
  filename: (req, file, callback) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    const name = `${fileName}-${Date.now()}${fileExtension}`;
    callback(null, name);
  },
});

export const uploadsVideoMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
