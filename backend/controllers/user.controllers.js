import User from '../models/user.model.js'
import uploadOnCloudinary from '../config/cloudinary.js'
import geminiResponse from '../gemini.js'
import { json, response } from 'express'
import moment from 'moment'

export const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId
        const user = await User.findById(userId).select('-password')
        if(!user){
            return res.status(400).json({message:"User Not Found!!"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"get Current User Error!!!"})
    }
}

export const updateAssistant = async(req,res)=>{
    try {
        const {assistantName, imageUrl} = req.body
        let assistantImage;
        console.log("📥 Body:", req.body);
        console.log("📸 File:", req.file);
        console.log("👤 User ID:", req.userId);
        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path)
        }else{
            assistantImage = imageUrl
        }
        console.log("🧠 Updating with:", { assistantName, assistantImage });
        const user = await User.findByIdAndUpdate(req.userId,{
            assistantName, assistantImage
        }, {new: true}).select('-password')
        console.log("🧩 Updated User:", user)
        return res.status(200).json(user)
    } catch (error) {
        console.error("🔥 Update Assistant Error:", error);
        return res.status(400).json({message:"Update Assistant Error!!!"})
    }
}


// export const askToAssistant = async (req,res)=>{
//     try {
//         const {command} = req.body
//         const user = await User.findById(req.userId);
//         const userName = user.name
//         const assistantName = user.assistantName
//         const assistantImage = user.assistantImage
//         const result = await geminiResponse(command,assistantName,userName)

//         const jsonmatch = result.match(/{[\s\s]*}/)
//         if(!jsonmatch){
//             return res.status(400).json({response: "Sorry, I can't Understand!"})
//         }
//         const gemResult = JSON.parse(jsonmatch[0])
//         const type = gemResult.type

//         switch(type){
//             case 'get_date' : 
//                 return res.json({
//                     type,
//                     userinput:gemResult.userinput,
//                     response: `Current date is ${moment().format('YYYY-MM-DD')}`
//                 });
//             case 'get_time' :
//                 return res.json({
//                     type,
//                     userinput:gemResult.userinput,
//                     response: `Current time is ${moment().format('HH:MM A')}`,
//                 });
//             case 'get_day' :
//                 return res.json({
//                     type,
//                     userinput:gemResult.userinput,
//                     response: `Today is ${moment().format('DDDD')}`,
//                 });
//             case 'get_month' :
//                 return res.json({
//                     type,
//                     userinput:gemResult.userinput,
//                     response: `Today is ${moment().format('MMMM')}`,
//                 });
//             case 'google_search':
//             case 'youtube_search':
//             case 'youtube_play':
//             case 'general':
//             case 'calculator_open':
//             case 'instagram_open':
//             case 'facebook_open':
//             case 'weather_show':
//                 return res.json({
//                     type,
//                     userinput: gemResult.userinput,
//                     response: gemResult.response,
//                 })
//             default:
//                 return res.status(400).json({response: "I didn't understand that command."})
//         }
//     } catch (error) {
//         return res.status(500).json({response: `Ask Assistant Error ${error}.`})
//     }
// }


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command);
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;
    const assistantImage = user.assistantImage;

    // Now result is already an object
    const gemResult = await geminiResponse(command, assistantName, userName);
    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      // handle all other types directly
      default:
        return res.json({
          type,
          userinput: gemResult.userinput,
          response: gemResult.response || "I'm not sure how to respond.",
        });
    }
  } catch (error) {
    console.error("❌ Backend Error:", error);
    return res.status(500).json({ response: `Ask Assistant Error ${error}` });
  }
};
