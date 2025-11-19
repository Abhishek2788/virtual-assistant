import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
  const {serverUrl,userData,setUserData,frontEndImage,setFrontEndImage,backendImage, setBackendImage,selectedImage, setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`w-20 h-40 lg:w-[150px] lg:h-[250px] bg-linear-to-t from-[black] to-[#030326] border-2 border-[#0000ff58] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?'border-4 border-white shadow-blue-950 shadow-2xl':null}`} onClick={()=>{
      setSelectedImage(image)
      setBackendImage(null)
      setFrontEndImage(null)
      }}>
        <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card
