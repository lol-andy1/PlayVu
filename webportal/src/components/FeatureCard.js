import React from "react";

const FeatureCard = ({ name, description }) => {
  return (
    <div className="relative group bg-gradient-to-br from-blue-100 to-green-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Decorative Circle */}
      <div className="absolute -top-5 -left-5 h-14 w-14 bg-gradient-to-tr from-blue-500 to-green-400 rounded-full opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300 mb-3">
          {name}
        </h2>
        <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;

