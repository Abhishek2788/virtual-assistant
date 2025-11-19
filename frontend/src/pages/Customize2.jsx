import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const Customize2 = () => {
    const {userData,serverUrl, backendImage, selectedImage, setUserData} = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.assistantName || '')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleUpdateAssistant=async()=>{
      setLoading(true)
      try {
        console.log("👉 Updating assistant...");

        let formData = new FormData()
        formData.append('assistantName',assistantName)
        if(backendImage){
          console.log("✅ Using backendImage");

          formData.append('assistantImage',backendImage)
        }
        else{
          console.log("✅ Using selectedImage");

          formData.append('imageUrl',selectedImage)
        }
        console.log("📡 Sending request to:", `${serverUrl}/api/user/update`);

        const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        setLoading(false)
        console.log(result.data)
        setUserData(result.data)
        navigate('/')
      } catch (error) {
        setLoading(false)
        console.error("❌ Error updating assistant:", error);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        } else if (error.request) {
          console.error("No response from server:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    }
  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 gap-5'>
        <IoArrowBackCircleOutline className='absolute top-8 left-8 text-white w-8 h-8 cursor-pointer' onClick={()=>navigate('/customize')} />
        <h1 className='text-white text-3xl mb-4 text-center font-semibold font-serif'>Enter Your <span className='text-blue-200'>Assistant Name</span></h1>
        <input type="text" placeholder='eg. sora' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} />
        {assistantName && <button className='min-w-[350px] h-[60px] mt-7 text-black font-semibold bg-white cursor-pointer rounded-full text-[19px]' disabled={loading} onClick={handleUpdateAssistant}>{!loading?'Execute Your Assistant':'Loading...'}</button>}
    </div>
  )
}

export default Customize2
