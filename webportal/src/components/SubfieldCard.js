import React from "react";

const SubfieldCard = ({subfield}) => {

  return (
    <div className="ml-auto w-[96%] border-2 border-[#1976d2] p-2 text-lg rounded-lg">
      <h1>{subfield.name}</h1>
    </div>
  )
}

export default SubfieldCard