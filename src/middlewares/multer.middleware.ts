import multer, { Multer } from 'multer';
import path from 'path';

export const SetUpMulterWithStorage = (uploadPath: string): Multer => {
  // Set up Multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename the file to avoid duplicates
    },
  });

  // Initialize Multer upload middleware
  const upload = multer({ storage: storage });

  return upload;
};
