import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { BACKEND_URL } from '../../utils/utils';

function Purchases() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [clothData, setClothData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      navigate("/login")
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error in Logging Out");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login")
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const fetchPurchases = async () => {
      if (!token) {
        toast.error("Please login to view purchases");
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setPurchases(response.data.purchased);
        setClothData(response.data.clothData);
      } catch (error) {
        console.error(error);
        setErrorMessage(error?.response?.data?.message || "Error fetching purchases");
      }
    };

    fetchPurchases();
  }, []);

  return (
    <>
      {/* Mobile Navbar with Hamburger */}
      <div className='lg:hidden flex items-center justify-between p-4 bg-[#754F23] text-white'>
        <h1 className='text-xl font-bold'>Purchases</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <FiMenu size={28} />
        </button>
      </div>

      <div className='flex min-h-screen bg-[#F0EADC]'>
        {/* Sidebar */}
        <div className={`fixed lg:relative top-0 left-0 h-full bg-[#F0EADC] text-white w-64 p-5 transition-transform duration-300 z-50 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          
          {/* Close button for mobile */}
          <div className='lg:hidden flex justify-end mb-5'>
            <button onClick={() => setIsSidebarOpen(false)}>
              <IoMdClose size={28} />
            </button>
          </div>

          <h1 className='text-xl font-bold mt-3 text-[#754F23]'>Profile</h1>

          <div className='mt-5 bg-[#754F23] py-2 rounded-xl text-center hover:scale-105 duration-150'>
            <Link to={"/"} className='hover:opacity-80 block'>Home</Link>
          </div>

          <div className='mt-5 bg-[#754F23] py-2 rounded-xl text-center hover:scale-105 duration-150'>
            <Link to={"/purchases"} className='hover:opacity-80 block'>Purchases</Link>
          </div>

          <div className='mt-5 bg-[#754F23] py-2 rounded-xl text-center hover:scale-105 duration-150'>
            <Link to={"/cloths"} className='hover:opacity-80 block'>Cloths</Link>
          </div>

          <div className='mt-5 bg-[#754F23] py-2 rounded-xl text-center cursor-pointer hover:scale-105 duration-150'>
            <button onClick={handleLogout} className='hover:opacity-80 w-full cursor-pointer'>Logout</button>
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
            <h1 className='font-extrabold text-4xl sm:text-5xl'>Your Purchases</h1>
            <hr className='w-[25vw] mt-2 border-t-2 border-[#94642d]' />
            <p className='mt-5'>Here are all the clothes you've purchased.</p>
          </div>

          <div className='flex pr-5 pl-5 md:pr-20 md:pl-20 justify-start flex-wrap gap-10 pb-10 pt-10'>
            {clothData.length > 0 ? (
              clothData.map((cloth) => (
                <div
                  key={cloth._id}
                  className='border border-[#94642d] rounded-lg p-5 w-80 hover:scale-105 duration-300 cursor-pointer hover:shadow-amber-600 hover:shadow-2xl'
                >
                  <img className='rounded-lg w-72 h-72 object-cover' src={cloth?.image?.url} alt={cloth.title} />
                  <h1 className='font-bold text-lg mt-2'>{cloth.title}</h1>
                  <div className='flex justify-between mt-1'>
                    <p className='text-sm w-[60%] text-gray-700'>{cloth.description}</p>
                    <h1 className='font-semibold'>${cloth.price}</h1>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-xl text-gray-600 ml-5'>You have no purchases yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Purchases;
