import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import aiI from '../assets/ai.gif'
import userI from '../assets/user.gif'
import { TiThMenuOutline } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";



const Home = () => {
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening,setListening] = useState(false)
  const [userText, setUserText] = useState('')
  const [aiText, setAiText] = useState('')
  const isSpeakingRef = useRef(false)
  const recongnitionRef = useRef(null)
  const synth = window.speechSynthesis
  const isRecognisingRef = useRef(false)
  const [menu,setMenu] = useState(false)
  const handleLogout = async ()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate('/signin')
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }
  const startRecognition = ()=>{
    if(!isSpeakingRef.current && !isRecognisingRef.current){
      try {
        recongnitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if(!error.message.includes("start")){
          console.error("Recognition Error: ",error)
        }
      }
    }
  }
  const speak = (text)=>{
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v=>v.lang === 'hi-IN');
    if(hindiVoice){
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current=true
    utterance.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      setTimeout(()=>{
        startRecognition()
      }, 800)
    }
    synth.cancel();
    synth.speak(utterance)
  }

  const handleCommand = (data)=>{
    const {type,userinput,response} = data
    speak(response);
    if(type==='google_search'){
      const query = encodeURIComponent(userinput);
      window.open(`https://google.com/search?q=${query}`,'_blank');
    }
    if(type==='calculator_open'){
      window.open(`https://google.com/search?q=calculator`,'_blank')
    }
    if(type==='instagram_open'){
      window.open(`https://www.instagram.com/`,'_blank')
    }
    if(type==='facebook_open'){
      window.open(`https://www.facebook.com/`,'_blank')
    }
    if(type==='weather_show'){
      window.open(`https://google.com/search?q=weather`,'_blank')
    }
    if(type==='youtube_search' || type==='youtube_play'){
      const query = encodeURIComponent(userinput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank')
    }
  }


  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition()
    recognition.continuous=true,
    recognition.lang='en-US'
    recongnitionRef.current=recognition


    const safeRecognition = ()=>{
      if(!isSpeakingRef.current && !isRecognisingRef.current){
        try {
          recognition.start()
          // isRecognisingRef.current = true
          console.log("Recognition requested to start");
        } catch (error) {
          // ignore InvalidStateError, log others
          if (error && error.name !== "InvalidStateError") {
            console.error(error)
          }
        }
      }
    }
    recognition.onstart = () =>{
      console.log("Recognition Started!");
      isRecognisingRef.current = true;
      setListening(true);
    };

    recognition.onend = ()=>{
      console.log("Recognition Ended!");
      isRecognisingRef.current = false;
      setListening(false);
      if (!isRecognisingRef.current) {
        setTimeout(()=>{
          safeRecognition();
        },1000)
      }
    };
    recognition.onerror = (event) =>{
      console.log("Recognition error: ", event.error);
      isRecognisingRef.current = false;
      setListening(false);
      if(event.error !== "aborted" && !isSpeakingRef.current){
        setTimeout(()=>{
          safeRecognition();
        }, 1000)
      }
    };

    recognition.onresult = async (e)=>{
      const transcript = e.results[e.results.length-1][0].transcript.trim();
      console.log('Heard '+transcript)
      if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
        setUserText(transcript)
        recognition.stop()
        isRecognisingRef.current=false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        setAiText(data.response)
        setUserText('')
        // console.log(data)
        handleCommand(data)
      }
    }

    const fallback = setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognisingRef.current){
        safeRecognition()
      }
    }, 10000);
    safeRecognition()
    return ()=>{
      recognition.stop()
      setListening(false)
      isRecognisingRef.current = false
      clearInterval(fallback)
    }
    
  },[])
  
  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-2.5'>
      <TiThMenuOutline className='lg:hidden text-white absolute top-5 right-5 w-7 h-7' onClick={()=>setMenu(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000020] backdrop-blur-lg p-5 flex gap-5 flex-col items-start ${menu?"translate-x-0":"translate-x-full"} transition-transform`}>
        <RxCross2 className='text-white absolute top-5 right-5 w-7 h-7' onClick={()=>setMenu(false)} />
        <button className='min-w-[150px] h-[60px] mt-7 text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] top-5 right-5' onClick={handleLogout}>Logout</button>
      <button className='min-w-[300px] h-[60px] top-24 right-5 mt-7 text-black font-semibold bg-white rounded-full px-5 py-2.5 text-[19px] cursor-pointer' onClick={()=>navigate('/customize')}>Customize Your Assistant</button>
      <div className='w-full h-0.5 bg-gray-400'></div>
      <h1 className='text-white font-semibold text-[20px]'>History</h1>
      <div className='w-full h-[400px] gap-5 flex flex-col overflow-y-auto '>
        {userData.history?.map((his,i)=>(
          <span key={i} className='text-gray-200 text-[18px]'>{his}</span>
        ))}
      </div>
      </div>
      <button className='absolute min-w-[150px] h-[60px] mt-7 text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] top-5 right-5 hidden lg:block' onClick={handleLogout}>Logout</button>
      <button className='absolute min-w-[300px] h-[60px] top-24 right-5 mt-7 text-black font-semibold bg-white rounded-full px-5 py-2.5 text-[19px] cursor-pointer hidden lg:block' onClick={()=>navigate('/customize')}>Customize Your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} className='h-full object-cover' />
      </div>
      <h1 className='text-white text-xl'>I'm {userData?.assistantName}</h1>
      {/* {userText && <img src={userI} alt='user img' className='w-[200px]' />} */}
      {!aiText && <img src={userI} alt='user img' className='w-[200px]' />}
      {aiText && <img src={aiI} alt='ai img' className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semibold'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home
