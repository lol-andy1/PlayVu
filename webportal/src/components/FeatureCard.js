import React from "react";

const FeatureCard = ({ name, description }) => {
  return (
    <div className="bg-gradient-to-tr from-blue-400 via-white to-green-500 p-6 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-semibold text-black mb-2">{name}</h2>
      <p className="text-black">{description}</p>
    </div>
  );
};

export default FeatureCard;
