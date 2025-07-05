// src/pages/Men.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import menBanner from "../assets/banner_mens.png";
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { BACKEND_URL } from '../../utils/utils';

function Men() {
  const [menCloths, setMenCloths] = useState([]);

  useEffect(() => {
    const fetchMenCloths = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/cloth/cloths`, {
          withCredentials: true,
        });
        const cloths = response.data.cloths;
        setMenCloths(cloths.filter((cloth) => cloth.category === 'men'));
      } catch (error) {
        console.error('Error fetching men cloths:', error);
      }
    };

    fetchMenCloths();
  }, []);

  return (
    <>
      <Navbar />
      <img src={menBanner} alt="" className="px-10 w-full object-cover" />

      <div className="pt-10 px-5 md:px-20 pb-10">
        <h1 className="font-extrabold text-3xl md:text-5xl">Men's Collection</h1>
        <hr className="w-40 md:w-[21vw] mt-2" />
        <p className="mt-3 md:mt-5 text-sm md:text-base">Have a look at Men's collection!</p>
      </div>

      <div className="px-5 md:px-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
          {menCloths.map((cloth) => (
            <div
              key={cloth._id}
              className="border border-[#94642d] rounded-lg p-5 w-full max-w-xs hover:scale-105 duration-300 cursor-pointer hover:shadow-amber-600 hover:shadow-2xl"
            >
              <img className="rounded-lg w-full" src={cloth?.image?.url} alt="" />
              <div>
                <h1 className="font-bold text-lg mt-2">{cloth.title}</h1>
                <div className="flex justify-between mt-1 text-sm">
                  <p className="w-2/3 truncate">{cloth.description}</p>
                  <h1 className="font-semibold">${cloth.price}</h1>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/productdisplay/${cloth._id}`}
                    className="bg-[#94642d] py-2 px-4 rounded-xl mt-3 cursor-pointer hover:bg-amber-700 text-white text-sm"
                  >
                    View
                  </Link>
                  <h1 className="font-bold mt-3 text-green-500 text-sm">25% off</h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Men;
