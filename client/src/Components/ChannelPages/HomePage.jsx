import React from 'react';

const HomePage = ({ channel }) => {
  if (!channel || !channel.bio) return null;

  return (
    <div className="w-full px-2 md:px-6 lg:px-12 text-white py-2 md:py-6">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b border-gray-700 pb-3 tracking-wide text-center">
        About the Channel
      </h2>

      <div className="flex justify-center w-full">
        <div className="bg-[#1a1a1a] p-2 sm:p-6 md:p-8 rounded-2xl border border-gray-700 shadow-lg text-gray-300 text-[12px] md:text-base whitespace-pre-line leading-relaxed text-center max-w-3xl w-full">
          {channel.bio}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
