import React, { useEffect, useRef, useState } from 'react'
import send from '../assets/send.png'
import axios from 'axios'
import { ScaleLoader } from 'react-spinners';
import { Typed } from 'react-typed';



const Chatbot = () => {



  const inputref = useRef()
  const [ques, setQues] = useState('')
  const [chat, setChat] = useState([])
  const [show, setShow] = useState(false)
  const [loading,setLoading] = useState(false)
  const typedref = useRef(null)
  const chatref = useRef()



  useEffect(() => {
    inputref.current.focus()

    const newobj = {
      strings : ['Can I Help You With Anything?'],
      typeSpeed : 30,
      showCursor : false
    }

    const typed = new Typed(typedref.current , newobj)

    return () => {
      typed.destroy()
    }

  }, [])

  useEffect(() => {
    chatref.current?.scrollIntoView({behavior : 'smooth'})
  },[chat])


  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='
  const api_key = 'AIzaSyCIoEvaVNR5aIJ2fbCE_NI9jrsUfrfd1iE'


  const getdata = () => {

    if(!ques.trim()) return;

    setShow(true)

    setChat(prev => [...prev , {type : 'user' , text : ques}])
    setQues('')

    const sendingdata = {
      "contents": [
        {
          "parts": [
            { "text": ques }
          ]
        }
      ]
    }


    
    setChat((prev) => [...prev , {type : 'bot' , text : '' , loading : true}])

    axios.post(`${url}${api_key}`, sendingdata)
      .then((res) => {
        const answer = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'no res found'
        setChat((prev) => {
          const updatedchat = [...prev]
          updatedchat[updatedchat.length - 1] = {type : 'bot' , text : answer , loading : false}
          return updatedchat
        })
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      })


  }

  const handlekeydown = (e) => {
    if(e.key === 'Enter')
    { 
      e.preventDefault()
      getdata()
    }
  }

  



  return (
    <>
      <div className={`w-[100%] h-[100vh] bg-gradient-to-r from-[#0B1E47] via-[#000000] to-[#0C2A6B]
 relative overflow-x-hidden  flex justify-center ${show ? '' : 'items-center'} py-10`}>

        {show  ? (
          <div className='overflow-y-auto w-full max-h-[65vh] 2xl:max-h-[75vh] flex flex-col gap-5 px-10'>
           
            {chat.map((item, idx) => (
              <div key={idx} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'} text`}>
                <div className={`p-3 m-2 rounded-lg shadow-lg max-w-[75%] ${item.type === 'user' && 'bg-[#1E3A8A] text-white'} ${item.type === 'bot' && !item.loading ? 'bg-[#1E293B] text-gray-300' : ''}`} ref={chatref}>
                {
                 item.type === 'bot' && item.loading ? (<ScaleLoader loading={true} color='#ffffff'/>) : (<p className='text-lg break-words'>{item.text}</p>)
                }
                </div>
              </div>
            ))}
          

          </div>
        )
        :
        (
          <div>
          <h2 className='text-gray-300 text-center text-3xl pb-5'>Hi , How Are You?</h2>
          <h1 className='text-white text-5xl text-center' ref={typedref}></h1>
          <p className='text-gray-400 py-5 max-w-160 text-center'>I'm here to assist you with anything you need. Whether it's a quick question or detailed help, just ask. I'll find the best solution for you in no time!</p>
        </div>
        )
        }

      
        <textarea type="text" value={ques} onChange={(e) => setQues(e.target.value)} ref={inputref} className='w-[95%] pr-25 break-words bg-[#0A192F] text-white absolute bottom-3 pb-15 px-5 text-2xl pt-3 rounded-2xl my-10 outline-none 	border border-blue-500 shadow-[0px_0px_10px_#1E40AF] overflow-y-auto h-28 resize-none' placeholder='Enter Your Prompt Here...' onKeyDown={handlekeydown}/>
        <button className='bg-yellow-200 cursor-pointer fixed xl:right-14 bottom-4 p-5 rounded-[50%] w-20 h-20 mx-2 bg-gradient-to-r from-blue-500 to-blue-900 lg:right-10 md:right-9 sm:right-7 right-5.5' onClick={getdata}>
          <img src={send} alt="send icon" className='filter invert'/>
        </button>
        </div>
      
        
    </>
  )
}

export default Chatbot