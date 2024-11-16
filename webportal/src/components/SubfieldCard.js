import React, { useEffect, useState, useRef } from "react";

const SubfieldCard = ({subfield}) => {

  return (
    <div className="ml-auto w-[96%] bg-red-400 p-2 rounded-lg">
      <h1>{subfield.name}</h1>
    </div>
  )
}

export default SubfieldCard