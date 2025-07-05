import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import dropDownIcon from "../assets/dropdown_icon.png";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { BACKEND_URL } from '../../utils/utils';

function Cloths() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allCloths, setAllCloths] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCategories, setShowCategories] = useState()
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`);
      toast.success(response.data.message || "Logged Out Successfully");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error in Logging Out");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const fetchAllCloths = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/cloth/cloths`, {
          withCredentials: true,
        });
        setAllCloths(response.data.cloths);
      } catch (error) {
        console.log("Error fetching all cloths:", error);
      }
    };
    fetchAllCloths();
  }, []);

  const filteredCloths = selectedCategory === "all"
    ? allCloths
    : allCloths.filter(cloth => cloth.category.toLowerCase() === selectedCategory);

  return (
    <>
      {/* Mobile Navbar with Hamburger */}
      <div className='lg:hidden flex items-center justify-between p-4 bg-[#754F23] text-white'>
        <h1 className='text-xl font-bold'>Collections</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <FiMenu size={28} />
        </button>
      </div>

      {/* Wrapper */}
      <div className='flex min-h-screen bg-[#F0EADC]'>
        {/* Sidebar */}
        <div className={`fixed lg:relative top-0 left-0 h-full bg-[#F0EADC] text-white w-64 p-5 transition-transform duration-300 z-50 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

          {/* Close Button for Mobile */}
          <div className='lg:hidden flex justify-end mb-5'>
            <button onClick={() => setIsSidebarOpen(false)}>
              <IoMdClose size={28} />
            </button>
          </div>

          <h1 className='text-xl font-bold mt-3 text-[#754F23]'>Profile</h1>

          <div className='mt-5 bg-[#754F23] py-2 rounded-xl text-center cursor-pointer hover:scale-105 duration-150'>
            <Link to={"/"} className='hover:opacity-80 block'>Home</Link>
          </div>

          <div className='mt-5'>
            <h2
              className='font-semibold mb-2 bg-[#754F23] py-2 rounded-xl text-center cursor-pointer'
              onClick={() => setShowCategories(!showCategories)}
            >
              Categories :-
            </h2>

            {showCategories && (
              <ul className='space-y-2 bg-[#754F23] py-2 rounded-xl text-center transition-all duration-300'>
                {["all", "men", "women", "kids"].map(cat => (
                  <li
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsSidebarOpen(false);
                    }}
                    className={`cursor-pointer capitalize hover:underline ${selectedCategory === cat ? "font-bold text-black" : "text-white"
                      }`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div className='mt-5 bg-[#754F23] py-2 rounded-xl text-center cursor-pointer hover:scale-105 duration-150r'>
            <Link to={"/purchases"} className='block hover:opacity-80 cursor-pointer'>Purchases</Link>
          </div>

          <div
            className='mt-5 bg-[#754F23] py-2 rounded-xl text-center cursor-pointer hover:scale-105 duration-150'
          >
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full h-full bg-transparent text-white hover:opacity-80 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-block w-full h-full bg-transparent text-white hover:opacity-80"
              >
                Login
              </Link>
            )}
          </div>

        </div>

        {/* Sidebar overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className='flex-1 overflow-x-hidden'>
          <div className='pt-10 px-5 md:px-20'>
            <h1 className='font-extrabold text-4xl sm:text-5xl'>Collections</h1>
            <hr className='w-[30vw] mt-2 border-t-2 border-[#94642d]' />
            <p className='mt-5'>Have a look at all our collections!</p>
          </div>

          {/* Product Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-5 md:px-20 py-10'>
            {filteredCloths.length > 0 ? (
              filteredCloths.map((cloth) => (
                <div
                  key={cloth._id}
                  className='border border-[#94642d] rounded-lg p-5 hover:scale-105 duration-300 cursor-pointer hover:shadow-amber-600 hover:shadow-2xl'
                >
                  <img className='rounded-lg w-full h-64 object-cover' src={cloth?.image?.url} alt={cloth.title} />
                  <h1 className='font-bold text-lg mt-2'>{cloth.title}</h1>
                  <div className='flex justify-between mt-1'>
                    <p className='text-sm text-gray-700 w-[60%]'>{cloth.description}</p>
                    <h1 className='font-semibold'>${cloth.price}</h1>
                  </div>
                  <div className='flex justify-between'>
                    <Link
                      to={`/buy/${cloth._id}`}
                      className='bg-[#94642d] py-2 px-4 rounded-xl mt-3 cursor-pointer hover:bg-amber-700 text-white'
                    >
                      Buy Now
                    </Link>
                    <h1 className='font-bold mt-3 text-green-500'>25% off</h1>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-xl text-gray-600 col-span-full'>No cloths available in this category.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cloths;
