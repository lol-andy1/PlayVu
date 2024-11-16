import React, { createContext, useState } from "react";
import axios from "axios";
import TouchableButton from "../components/TouchableButton";
import Dialog from '@mui/material/Dialog';
import { Link, Outlet } from "react-router-dom";

export const GameContext = createContext()

const Organize = () => {
  const [gameData, setGameData] = useState({})
  const [subfield, setSubfield] = useState({})


  return (
    <GameContext.Provider value={{gameData, setGameData, subfield, setSubfield}}>
      <div className="relative text-center py-2 w-full border-b border-gray-300">
        <h1 className="text-3xl font-semibold">Organize</h1>
      </div>
      <Outlet/>
    </GameContext.Provider>
  )
}

export default Organize