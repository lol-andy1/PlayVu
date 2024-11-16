import React, { useEffect, useState, useRef } from "react";

const FieldCard = ({field}) => {

  return (
    <div className="w-full h-full bg-green-400 p-2 rounded-lg">
      <h1 className="text-xl">{"Venue: " + field.fieldName}</h1>
      <p>{"Address: " + field.address + " " + field.city + " " + field.zipCode}</p>
    </div>
  )
}

export default FieldCard