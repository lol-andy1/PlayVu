import React from "react";

const FeatureCard = ({ name, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-semibold text-green-500 mb-2">{name}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
