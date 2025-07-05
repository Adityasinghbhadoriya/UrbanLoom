import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import star_icon from "../assets/star_icon.png";
import star_dull_icon from "../assets/star_dull_icon.png";
import Navbar from './Navbar';
import DescriptionBox from './DescriptionBox';
import Footer from './Footer';
import { BACKEND_URL } from '../../utils/utils';

const ProductDisplay = () => {
  const { id } = useParams();
  const [cloth, setCloth] = useState(null);

  useEffect(() => {
    const fetchCloth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/cloth/${id}`);
        setCloth(res.data.cloth);
      } catch (err) {
        console.log("Error fetching product:", err);
      }
    };
    fetchCloth();
  }, [id]);

  if (!cloth) return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <>
    <Navbar/>
    <div className='min-h-screen w-full  px-4 md:px-10 lg:px-20 py-10 flex flex-col lg:flex-row gap-10 text-[#333] bg-[#F0EADC]'>
      
      {/* Left Section - Thumbnails + Main Image */}
      <div className='flex flex-col lg:flex-row gap-6 w-full lg:w-1/2'>
        
        {/* Thumbnail List */}
        <div className='flex lg:flex-col gap-4 overflow-x-auto hide-scrollbar'>
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              src={cloth.image?.url}
              alt="thumbnail"
              className='w-24 h-28 rounded-md border object-cover cursor-pointer hover:scale-105 transition'
            />
          ))}
        </div>

        {/* Main Image */}
        <div className='flex-1'>
          <img
            src={cloth.image?.url}
            alt="main"
            className='w-full max-h-[550px] object-contain rounded-xl border shadow'
          />
        </div>
      </div>

      {/* Right Section - Product Info */}
      <div className='w-full lg:w-1/2 flex flex-col justify-start gap-6'>
        
        <h1 className='text-3xl md:text-4xl font-bold leading-snug'>{cloth.title}</h1>

        {/* Ratings */}
        <div className='flex items-center gap-1'>
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="star" className='w-5 h-5' />
          ))}
          <img src={star_dull_icon} alt="half star" className='w-5 h-5' />
          <p className='ml-2 text-sm text-gray-600'>122</p>
        </div>

        {/* Price */}
        <div className='flex items-center gap-4 text-xl font-medium'>
          <p className='line-through text-gray-500'>${cloth.old_price || "200"}</p>
          <p className='text-[#ff3e3e] font-bold'>${cloth.price}</p>
        </div>

        {/* Description */}
        <p className='text-[15px] text-gray-700 leading-relaxed'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, quaerat? Adipisci ipsam labore corporis
        </p>

        {/* Sizes */}
        <div>
          <h2 className='text-lg font-semibold mb-2'>Select Size</h2>
          <div className='flex gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <div
                key={size}
                className='px-4 py-2 border rounded-md text-sm cursor-pointer hover:bg-[#754F23] hover:text-white transition'
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <Link to={`/buy/${cloth._id}`}  className='bg-[#ff3e3e] hover:bg-[#e43434] text-white text-base font-bold py-3 px-8 rounded-md transition w-max cursor-pointer'>
          Buy
        </Link>

        {/* Category & Tags */}
        <p className='text-base'><span className='font-semibold'>Category :</span> {cloth.category || "Women, T-Shirt, Crop Top"}</p>
        <p className='text-base'><span className='font-semibold'>Tags :</span> Modern, Latest</p>
      </div>

      {/* Scrollbar Hide */}
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
    <DescriptionBox/>
    <Footer/>
    </>
  );
};

export default ProductDisplay;
