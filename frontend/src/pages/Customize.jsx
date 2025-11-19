import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { FaRegImages } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackCircleOutline } from "react-icons/io5";


const Customize = () => {
  const {serverUrl,userData,setUserData,frontEndImage,setFrontEndImage,backendImage, setBackendImage,selectedImage, setSelectedImage} = useContext(userDataContext)
  const inputImage = useRef()
  const navigate = useNavigate()
  const handleImage = (e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontEndImage(URL.createObjectURL(file))
  }
  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 gap-5'>
      <IoArrowBackCircleOutline className='absolute top-8 left-8 text-white w-8 h-8 cursor-pointer' onClick={()=>navigate('/')} />
      <h1 className='text-white text-3xl mb-4 text-center font-semibold font-serif'>Select Your Assistant Image</h1>
       <div className='w-full max-w-[60%] flex justify-center items-center flex-wrap gap-5'>
            <Card image={image1} />
            <Card image={image2} />
            <Card image={image3} />
            <Card image={image4} />
            <Card image={image5} />
            <Card image={image6} />
            <Card image={image7} />
            <div className={`w-20 h-40 lg:w-[150px] lg:h-[250px] bg-linear-to-t from-[black] to-[#030326] border-2 border-[#0000ff58] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=='input'?'border-4 border-white shadow-blue-950 shadow-2xl':null}`} onClick={()=>{
              inputImage.current.click()
              setSelectedImage('input')
              }}>
              {!frontEndImage && (<><FaRegImages className='text-white w-5 h-5 lg:w-8 lg:h-8' /><IoIosAdd className='text-white w-5 h-5 lg:w-8 lg:h-8' /></>)}
              {frontEndImage && <img src={frontEndImage} className='h-full object-cover' />}
            </div>
            <input type="file" accept='image/*' hidden ref={inputImage} onChange={handleImage}/>
       </div>
       {selectedImage && <button className='min-w-[150px] h-[60px] mt-7 text-black font-semibold bg-white cursor-pointer rounded-full text-[19px]' onClick={()=>navigate('/customize2')}>Next</button>}
    </div>
  )
}

export default Customize
