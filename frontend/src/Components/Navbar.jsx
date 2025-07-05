import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react'; // Optional: install lucide-react or use SVGs
import { Link, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";
import { BACKEND_URL } from '../../utils/utils';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(()=>{
    const token = localStorage.getItem("user")
    if(token){
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  },[location])

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`);
      toast.success(response.data.message || "Logged Out Successfully");

      // Clear localStorage and update state
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error in Logging Out");

      localStorage.removeItem("user");
     setIsLoggedIn(false);
    }
  }

  return (
    <div className='w-full '>
      <div className='flex items-center justify-between px-6 md:px-20 py-5'>
        <Link to={"/"} className='font-extrabold text-2xl md:text-3xl text-[#754F23] cursor-pointer'>
          URBANLOOM
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-20 text-xl items-center'>
          <Link to={"/"} className='hover:text-[#754F23] duration-300'><a href="#">Shop</a></Link>
          <Link to={"/men"} className='hover:text-[#754F23] duration-300'><a href="#">Men</a></Link>
          <Link to={"/women"} className='hover:text-[#754F23] duration-300'><a href="#">Women</a></Link>
          <Link to={"/kids"} className='hover:text-[#754F23] duration-300'><a href="#">Kids</a></Link>
        </ul>

        {/* Desktop Buttons */}
        <div className='hidden md:flex gap-3'>
          {isLoggedIn ? (
            <button onClick={handleLogout} className='bg-[#754F23] text-white py-2 px-5 rounded-xl hover:bg-[#bc9466] duration-300 hover:scale-105 font-bold cursor-pointer'>
              Logout
            </button>

          ) : (
            <>
              <Link to={"/login"} className='bg-[#754F23] text-white py-2 px-5 rounded-xl hover:bg-[#bc9466] duration-300 hover:scale-105 font-bold'>
                Login
              </Link>
              <Link to={"/signup"} className='bg-[#754F23] text-white py-2 px-5 rounded-xl hover:bg-[#bc9466] duration-300 hover:scale-105 font-bold'>
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Icon */}
        <div className='md:hidden'>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='md:hidden px-6 pb-4 flex flex-col gap-4 bg-white shadow-md'>
          <a href="#" className='hover:text-[#754F23] text-lg'>Shop</a>
          <a href="#" className='hover:text-[#754F23] text-lg'>Men</a>
          <a href="#" className='hover:text-[#754F23] text-lg'>Women</a>
          <a href="#" className='hover:text-[#754F23] text-lg'>Kids</a>
          <div className='flex gap-2 pt-2'>
            <Link to={"/login"} className='bg-[#754F23] text-white py-2 px-4 rounded-xl hover:bg-[#bc9466] duration-300 font-bold'>
              Login
            </Link>
            <Link to={"/signup"} className='bg-[#754F23] text-white py-2 px-4 rounded-xl hover:bg-[#bc9466] duration-300  font-bold'>
              Signup
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
