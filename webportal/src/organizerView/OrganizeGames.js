import React, { useContext, useEffect } from "react";
import TouchableButton from "../components/TouchableButton";
import { useFetcher, useNavigate } from "react-router-dom";
import { GameContext } from "./Organize"

const Organize = () => {
  const navigate = useNavigate()
  const { setCurrStep } = useContext(GameContext)

  const createNewGame = () => {
    navigate("/organize/select-field")
    setCurrStep(0)
  }

  useEffect(() => {
    setCurrStep(-1)
  }, [])

  return (
    <div className="flex justify-center">
      <TouchableButton 
        onClick={createNewGame}
        label="Create New Game"
        twStyle="bg-green-300 p-2 rounded-md"
      />
    </div>
  )
}

export default Organize