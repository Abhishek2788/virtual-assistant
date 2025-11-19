// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'
// const uploadOnCloudinary = async (filePath)=>{
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET_KEY
//     });
//     try {
//         const uploadResult = await cloudinary.uploader
//         .upload(filePath)
//         fs.unlinkSync(filePath)
//         return uploadResult.secure_url

//     } catch (error) {
//         fs.unlinkSync(filePath)
//         return res.status(400).json({message: "Cloudinary Error!!"})
//     }
// }

// export default uploadOnCloudinary

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "assistants", // optional, organize uploads
      resource_type: "auto"
    });

    // Delete the local file safely
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url;

  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);

    // Safely remove the local file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Throw error so your route catch block can handle it
    throw new Error("Cloudinary upload failed");
  }
}

export default uploadOnCloudinary;
