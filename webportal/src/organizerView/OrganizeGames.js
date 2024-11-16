import React, { useEffect, useState } from "react";
import TouchableButton from "../components/TouchableButton";
import { Link, Outlet } from "react-router-dom";


const Organize = () => {

  return (
    <div>
      <Link to="/organize/select-field">
        <TouchableButton 
          label="Create New Game"
        />
      </Link>
    </div>
  )
}

export default Organize