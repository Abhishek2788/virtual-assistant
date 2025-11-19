import React, { useContext, useState } from 'react'
import robo from '../assets/robo.jpg'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {serverUrl,userData,setUserData} = useContext(userDataContext)
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [rerror,setRerror] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSIgnUp = async (e)=>{
    e.preventDefault()
    setRerror("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`,{
        name,email,password
      },{withCredentials: true})
      setUserData(result.data)
      setLoading(false)
      navigate('/customize')
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setRerror(error.response.data.message)
    }
  }
  return (
    <div className='w-full h-screen bg-cover flex justify-center items-center' style={{backgroundImage: `url(${robo})`}}>
      <form className='w-[90%] h-[700px] max-w-[500px] bg-[#05050520] backdrop-blur shadow-black flex flex-col items-center justify-center gap-5 px-5' onSubmit={handleSIgnUp}>
        <h1 className='text-white text-3xl font-semibold mb-7'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
        <input type="text" placeholder='Enter Your Name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full' required onChange={(e)=>setName(e.target.value)} value={name} />
        <input type="text" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2.5 rounded-full' required onChange={(e)=>setEmail(e.target.value)} value={email} />
         <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
          <input type={showPassword?"text":"password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-5 py-5' required onChange={(e)=>setPassword(e.target.value)} value={password} />
          {!showPassword && <IoMdEye className='absolute top-4 right-5 h-6 w-6 text-white' onClick={()=>setShowPassword(true)} />}
          {showPassword && <IoMdEyeOff className='absolute top-4 right-5 h-6 w-6 text-white' onClick={()=>setShowPassword(false)} />}
         </div>
         {rerror.length>0 && <p className='text-red-600'>*{rerror}</p>}
         <button className='min-w-[150px] h-[60px] mt-7 text-black font-semibold bg-white rounded-full text-[19px]' disabled={loading}>{loading?"Loading....":"Sign Up"}</button>
         <p className='text-white text-[18px]'>Already have an account ? <span className='text-blue-400 cursor-pointer' onClick={()=>navigate("/signin")}>Sign In</span></p>
      </form>
    </div>
  )
}

export default SignUp