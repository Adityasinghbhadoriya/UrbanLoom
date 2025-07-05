import React from 'react';

const DescriptionBox = () => {
  return (
    <div className='w-full max-w-6xl mx-auto  px-5'>
      {/* Tabs */}
      <div className='flex gap-2 md:gap-5'>
        <div className='text-sm md:text-base font-semibold w-40 md:w-44 h-14 border flex items-center justify-center'>
          Description
        </div>
        <div className='text-sm md:text-base font-semibold w-40 md:w-44 h-14 border flex items-center justify-center bg-[#754F23] text-white'>
          Reviews (122)
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col gap-6 border p-6 md:p-10 mt-4 bg-white text-[#333] text-sm md:text-base leading-relaxed'>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et adipisci placeat deserunt assumenda atque sunt odit dolorum animi reprehenderit, excepturi nisi nulla possimus! Tempore consequuntur culpa earum ab nulla perferendis aperiam aliquam quae omnis!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, nulla sed? Illum mollitia libero dignissimos nisi placeat id, delectus eveniet incidunt dolorem itaque, dolores consequuntur?
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
