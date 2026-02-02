import React from 'react'

export default function ErrorBoxNotification({emailEx,setEmailEx}) {
  console.log({emailEx})
  return (
    <>
      {/* Overlay con sfocatura */}
      <div className='fixed top-28 w-80 m-10 h-36  inset-0 shadow-2xl rounded-lg justify-self-center backdrop-blur-sm'></div>
      {/* Contenuto della notifica */}
      <div className='border border-white/15 h-36 justify-self-center  fixed top-28 w-80 m-10 rounded-lg bg-violet-900 bg-opacity-50 z-50 shadow-2xl'>
      
           <p className='text-white text-sm m-5 font-medium'  >{emailEx?.message}</p>
    
        <div className='justify-self-center'>
          <button className='btn-primary ' onClick={()=>setEmailEx({error:false,message: ''})}>Continua</button>
        </div>
      </div>
    </>
  )
}
