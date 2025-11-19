import React, { createContext, useEffect, useState } from "react"
import axios from 'axios'

export const userDataContext = createContext()
const UserContext = ({children}) => {
    const serverUrl = "http://localhost:5000"
    const [userData,setUserData] = useState(null)
    const [frontEndImage,setFrontEndImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleCurrentUser = async()=>{
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials: true})
        setUserData(result.data)
        console.log(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const getGeminiResponse = async (command)=>{
      try {
        console.log('sending to url....')
        const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials: true})
        console.log(result.data)
        return result.data
      } catch (error) {
        console.error('❌ Error in getGeminiResponse:');
        if (error.response) {
          console.error('Server responded with:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response received from server:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        throw error;
      }
    }

    useEffect(()=>{
      handleCurrentUser()
    },[])
    const value = {
        serverUrl,userData,setUserData,frontEndImage,setFrontEndImage,backendImage, setBackendImage,selectedImage, setSelectedImage, getGeminiResponse
    }
  return (
    <div>
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
