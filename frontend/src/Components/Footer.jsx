import React from 'react';
import footer_logo from "../assets/logo_big.png";
import instagram_icon from "../assets/instagram.png";
import twitter_icon from "../assets/twitter.png";
import linkedin_icon from "../assets/linkedin.png";
import youtube_icon from "../assets/youtube.png";
import facebook_icon from "../assets/facebook.png";

function Footer() {
  return (
    <div>
              {/* Footer */}
              <div className='footer px-5 md:px-20 pt-40 pb-10 flex flex-col items-center justify-center'>
                <div className="flex items-center gap-3">
                  <img className='w-14' src={footer_logo} alt="" />
                  <p className='text-4xl sm:text-5xl'>SHOPPER</p>
                </div>
                <ul className="flex flex-wrap justify-center gap-6 mt-5 text-xl sm:text-2xl">
                  <li>Company</li>
                  <li>Products</li>
                  <li>Offices</li>
                  <li>About</li>
                  <li>Contact</li>
                </ul>
                <div className="flex flex-wrap justify-center w-full mt-5 gap-6 sm:gap-10">
                  {[instagram_icon, twitter_icon, linkedin_icon, facebook_icon, youtube_icon].map((icon, i) => (
                    <img key={i} src={icon} alt="icon" className='w-6 h-6' />
                  ))}
                </div>
                <div className="footer-copyright flex flex-col items-center justify-center">
                  <hr className='mt-5 w-[90vw]' />
                  <p className='mt-5 text-lg sm:text-2xl text-center'>Copyright @ 2025 - All Right Reserved</p>
                </div>
              </div>
    </div>
  )
}

export default Footer