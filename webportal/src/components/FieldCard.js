import React from "react";

const FieldCard = ({field}) => {

  return (
    <div className="w-full h-full border-2 border-[#16a34a] p-4 rounded-lg">
      <div className="flex justify-between">
        <p className="text-xl">{"Venue: " + field.fieldName}</p>
        <p>${field.price}/hr</p>
      </div>
      <p>{"Address: " + field.address + " " + field.city + " " + field.zipCode}</p>
    </div>
  )
}

export default FieldCard