import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./Organize"

import Button from '@mui/material/Button';

const Organize = () => {
  const navigate = useNavigate()
  const { setCurrStep } = useContext(GameContext)

  const createNewGame = () => {
    navigate("/organize/select-field")
    setCurrStep(0)
  }

  return (
    <div className="flex justify-center mt-4">
      <Button 
        onClick={createNewGame} variant="contained" color="success" disableElevation 
      >
        Create New Game
      </Button>
    </div>
  )
}

export default Organize