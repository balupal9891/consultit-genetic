// import multer from 'multer';
// import path from 'path';

// // Define storage strategy
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads/genetic_res')); // where files are stored
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext); // filename format
//   }
// });

// // Filter file types (optional - CSV only)
// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype === 'text/csv') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only CSV files are allowed'));
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit (optional)
//   },
// });

// middlewares/multer.middleware.ts
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

