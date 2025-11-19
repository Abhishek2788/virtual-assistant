// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,"./public")
//     },
//     filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//     }
// })

// const upload = multer({storage})

// export default upload;



import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure public folder exists
const uploadPath = path.resolve("./public");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // create unique filename with timestamp
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
