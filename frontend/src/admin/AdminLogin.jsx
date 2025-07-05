import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';
import { BACKEND_URL } from '../../utils/utils';

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const navigate = useNavigate();
  

  const handleSubmit =async (e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post(`${BACKEND_URL}/admin/login`,{
        email,
        password
      },{
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("Login Successfull ", response.data)
      toast.success(response.data.message)
      // With this:
      const { user, token } = response.data;
      localStorage.setItem("admin", JSON.stringify({ user, token }));
      navigate("/admin/dashboard")
    } catch (error) {
      if(error.response){
        setErrorMessage(error.response.data.message || "Login Failed")
      } 
    }
  }

  return (
   <>
  
      <div className='flex items-center justify-center  pb-10 h-screen w-full  bg-[#F0EADC]'>
        <div className='w-110 rounded-3xl bg-[#754F23]'>
          <h1 className='font-bold text-3xl text-center p-4 text-white'>Welcome to <Link to={"/"} className='text-[#d49e1f] hover:text-[#e7d2a3]'>UrbanLoom</Link></h1>
          <h1 className='text-center text-white'>Just Login To Join Us!</h1>
          <form className='mt-9' onSubmit={handleSubmit} >

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-90 px-4 py-3 mt-6 border bg-[#F0EADC] border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ml-10"
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-90 px-4 py-3 mt-6 border bg-[#F0EADC] border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ml-10"
              placeholder="Password"
            />
            {/* ✅ Show error message if exists */}
            {errorMessage && (
              <div className="text-red-500 text-center mt-4 px-6 break-words max-w-[90%] mx-auto">
                {errorMessage}
              </div>
            )}
            <button type='submit' className='w-90 px-4 py-3 mt-5 ml-10 mb-5 rounded-xl bg-[#d49e1f] text-black font-bold text-[18px] hover:scale-105 duration-300 hover:bg-blue-400 cursor-pointer'>Login</button>
            <h1 className='text-center mb-5 text-white'>Don't have an account? <Link to={"/admin/signup"} className='text-[#e7d2a3] font-bold hover:text-[#c7ae76]'>Signup</Link></h1>
          </form>

        </div>
      </div>
    </>
  )
}

export default AdminLogin