import React from "react";

const SubfieldCard = ({subfield}) => {

  return (
    <div className="ml-auto w-[96%] bg-blue-300 p-2 rounded-lg">
      <h1>{subfield.name}</h1>
    </div>
  )
}

export default SubfieldCard