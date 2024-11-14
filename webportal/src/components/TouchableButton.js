import React, { useState } from "react";

const TouchableButton = ({label, onClick, disabled, style}) => {
  const [touch, setTouch] = useState(false);

  const handleTouch = () => {
    setTouch(true)
  }

  const handleRelease = () => {
    setTouch(false)
  }

  return (
    <button
      className={`bg-gray-300 rounded-md p-2 ${style} ${touch ? 'bg-opacity-70' : 'bg-opacity-100'}`}
      onTouchStart={handleTouch}
      onTouchEnd={handleRelease}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default TouchableButton
