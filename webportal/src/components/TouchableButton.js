import React, { useState } from "react";

const TouchableButton = ({label, onClick, disabled, twStyle, children}) => {
  const [touch, setTouch] = useState(false);

  const handleTouch = () => {
    setTouch(true)
  }

  const handleRelease = () => {
    setTouch(false)
  }

  return (
    <button
      className={`flex justify-center items-center ${twStyle} ${disabled ? 'bg-opacity-50': (touch ? 'bg-opacity-70' : 'bg-opacity-100')}`}
      onTouchStart={handleTouch}
      onTouchEnd={handleRelease}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {label}
    </button>
  )
}

export default TouchableButton
