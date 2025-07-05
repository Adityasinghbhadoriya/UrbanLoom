import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import womenImage from "../assets/women.png";
import axios from "axios";
import footer_logo from "../assets/logo_big.png";
import instagram_icon from "../assets/instagram.png";
import twitter_icon from "../assets/twitter.png";
import linkedin_icon from "../assets/linkedin.png";
import youtube_icon from "../assets/youtube.png";
import facebook_icon from "../assets/facebook.png";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import saleBanner from "../assets/Ecommerce_sale_banner.jpg";
import Footer from './Footer';
import { BACKEND_URL } from '../../utils/utils';

function Home() {

  const [trendingCloths, setTrendingCloths] = useState([]);
  const [menCloths, setMenCloths] = useState([]);
  const [womenCloths, setWomenCloths] = useState([]);

  useEffect(() => {
    const fetchCloths = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/cloth/cloths`, {
          withCredentials: true
        });
        const allCloths = response.data.cloths;

        setTrendingCloths(allCloths.filter(c => c.category === "trending").slice(0, 4));
        setMenCloths(allCloths.filter(c => c.category === "men").slice(0, 4));
        setWomenCloths(allCloths.filter(c => c.category === "women").slice(0, 4));

      } catch (error) {
        console.log("Error in Fetching Cloths", error);
      }
    };
    fetchCloths();
  }, []);

  return (
    <div className='min-h-screen w-full bg-[#F0EADC]'>
      <Navbar />

      {/* Hero Section */}
      <div className='flex flex-col lg:flex-row items-center justify-between px-5 md:px-20 mt-5 gap-10'>
        <div className='text-center lg:text-left'>
          <h1 className='text-4xl md:text-6xl lg:text-8xl font-bold leading-tight'>
            Elevate Style,<br /> Embrace Story
          </h1>
          <p className='mt-5 text-sm md:text-base'>
            We provide the largest clothing collection for any season. You can choose trendy<br className='hidden md:inline' />
            or classy design according to your preferences. Our services are superfast and we<br className='hidden md:inline' />
            update within 24 hours.
          </p>
          <div className='mt-5'>
            <Link to={"/cloths"} className='bg-[#754F23] text-white text-base md:text-lg py-2 px-7 md:px-9 rounded-xl hover:bg-[#bc9466] duration-300 hover:scale-105 cursor-pointer mt-5'>
              Explore
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className='relative w-full lg:w-[50vw] h-[50vh] lg:h-[70vh]'>
          <div className='absolute bg-[#F0EADC] border-2 border-[#94642d] rotate-6 w-[80%] h-[80%] top-[20%] left-[15%] rounded-3xl z-0'></div>
          <div className='absolute bg-[#94642d] w-[80%] h-[80%] top-[20%] left-[15%] rounded-3xl z-0'></div>
          <img src={womenImage} alt="Woman" className='absolute w-full h-full z-10' />
        </div>
      </div>

      {/* Banner */}
      <div className='mt-8 pt-20 px-5 md:px-20 pb-10'>
        <img src={saleBanner} alt="" className='w-full rounded-xl shadow-2xl' />
      </div>

      {/* Reusable Card Section */}
      {[
        { title: "Trending Collection", data: trendingCloths, width: "25vw", subtitle: "Have a look at what's trending now!" },
        { title: "Men's Collection", data: menCloths, width: "21vw", subtitle: "Have a look at Men's collection!" },
        { title: "Women's Collection", data: womenCloths, width: "25vw", subtitle: "Have a look at Women's collection!" }
      ].map((section, index) => (
        <div key={index}>
          <div className='pt-20 px-5 md:px-20 pb-10'>
            <h1 className='font-extrabold text-5xl'>{section.title}</h1>
            <hr className={`w-[${section.width}] mt-2`} />
            <p className='mt-5'>{section.subtitle}</p>
          </div>
          {/* Responsive horizontal scroll */}
          <div className='flex overflow-x-auto overflow-y-visible gap-6 px-5 md:px-20 hide-scrollbar py-4'>
            {section.data.map((cloth) => (
              <div
                key={cloth._id}
                className='border border-[#94642d] rounded-lg p-5 w-80 hover:scale-105 duration-300 cursor-pointer hover:shadow-amber-600 hover:shadow-2xl flex-shrink-0 bg-[#F0EADC]'
              >
                <img className='rounded-lg w-72' src={cloth?.image?.url} alt="" />
                <div>
                  <h1 className='font-bold text-lg mt-2'>{cloth.title}</h1>
                  <div className='flex justify-between mt-1'>
                    <p>{cloth.description}</p>
                    <h1>${cloth.price}</h1>
                  </div>
                  <div className='flex justify-between'>
                    <Link
                      to={`/productdisplay/${cloth._id}`}
                      className='bg-[#94642d] py-2 px-4 rounded-xl mt-3 cursor-pointer hover:bg-amber-700 text-white'
                    >
                      View
                    </Link>
                    <h1 className='font-bold mt-3 text-green-500'>25% off</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}


      <Footer />

      {/* Optional scrollbar hider */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Home;
