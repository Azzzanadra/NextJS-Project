"use client"

import React, {useState, useEffect} from 'react';
import {FaFacebookF, FaLinkedin,FaGoogle, FaRegEnvelope} from 'react-icons/fa';
import {MdLockOutline} from 'react-icons/md';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '../app/globals.css';

function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // const credentials = { username: 'johnd', password: 'm38rmF$' };
  const handleLogin = async() =>{
    try{
      setError('');
      const response = await axios.post('https://fakestoreapi.com/auth/login', credentials, {
        headers: { 'Content-Type': 'application/json' }
      });  
      const token = response.data.token

      if (token){
        localStorage.setItem("authToken", token);
        router.push("/MainPageAdmin");    
      }
    }
    catch(error) {
      setError('Username or Password incorrect')
    }
  }

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      router.push("/MainPageAdmin");
    }
  }, []);


  return (
    <div className="flex items-center justify-items-center min-h-screen bg-gray-100 p-8 pb-20 gap-16 max-sm:p-5 text-black">
    <head>
      <title>
        NextJS Project
      </title>
    </head>
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center max-sm:p-0 ">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row justify-around gap-4 w-full max-w-4xl p-6 max-sm:w-full">
        <div className="w-full md:w-3/5 p-3">
        <div onClick={() => router.push('/')} className="text-left cursor-pointer font-bold">
          Weasydoo
        </div>
        <div className="py-6 sm:py-10">
          <h2 className="text-3xl font-bold text-blue-400 mb-2 max-sm:text-2xl">Sign-in Account</h2>
          <div className="border-2 w-20 border-blue-400 inline-block mb-4"></div>

          {/* Social Media Icons */}
          <div className="flex justify-center my-3">
            <a href="#" className="border-gray-200 border-2 rounded-full p-3 mx-1">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="border-gray-200 border-2 rounded-full p-3 mx-1">
              <FaLinkedin className="text-sm" />
            </a>
            <a href="#" className="border-gray-200 border-2 rounded-full p-3 mx-1">
              <FaGoogle className="text-sm" />
            </a>
          </div>

          <p className="text-gray-500 mb-4">Or use your email and password</p>

          {/* Input Fields */}
          <div className="flex flex-col items-center w-full">
            <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3">
              <FaRegEnvelope className="text-gray-400 m-2" />
              <input type="text" name="username" placeholder="User name" onChange={handleChange} className="bg-gray-100 outline-none text-sm flex-1" />
            </div>
            <div className="bg-gray-100 w-full max-w-xs p-2 flex items-center mb-3">
              <MdLockOutline className="text-gray-400 m-2" />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} className="bg-gray-100 outline-none text-sm flex-1" />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between w-full max-w-xs text-xs mb-5">
              <label className="flex items-center">
                <input type="checkbox" name="remember" className="mr-1" />
                Remember me
              </label>
              <a href="#" className="text-blue-400">Forgot Password?</a>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Login Button */}
            <a onClick={handleLogin} className="cursor-pointer w-full max-w-xs border-2 border-blue-400 text-blue-400 px-12 py-2 rounded-full font-semibold hover:bg-blue-400 hover:text-white">
              Login
            </a>
          </div>
        </div>
      </div>
        {/* Signup
        <div className="bg-blue-400 w-2/5 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
          <h2 className='text-3xl font-bold mb-2'>Sign-up</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p className='mb-10'>Sign up with us here.</p>
          <a href="/Signup" className='border-2 border-white inline-block px-12 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-400'>Sign up</a>
        </div>           */}
      </div>

    </main>
  </div>
  )
}

export default Login