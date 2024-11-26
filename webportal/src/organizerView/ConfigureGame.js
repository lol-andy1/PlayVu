import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GameContext } from "./Organize"
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

const ConfigureGame = () => {
  const { setGameData, setCurrStep } = useContext( GameContext )
  const { user } = useAuth0()
  const navigate = useNavigate()

  const [gameName, setGameName] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(22)
  const [price, setPrice] = useState("")

  const marks = [
    {value: 14, label: "14"},
    {value: 16, label: "16"},
    {value: 18, label: "18"},
    {value: 20, label: "20"},
    {value: 22, label: "22"},
  ]

  const changeGameName = (event) => {
    setGameName(event.target.value)
  } 
  const changeTeamSize = (event) => {
    setMaxPlayers(event.target.value)
  }
  const changePrice = (event) => {
    setPrice(event.target.value)
  }

  const handleSubmit = () => {
    setGameData((prevData) => ({
      ...prevData,
      name: gameName,
      maxPlayers: maxPlayers,
      price: price
    }))

    navigate("/organize/confirm")
    setCurrStep(3)
  }

  useEffect(() => {
    setGameName(user.nickname + "'s Game")
  }, [user])

  return (
    <div className="p-4 flex-col space-y-4 ">
      <div className="flex items-center">
        <h1 className="w-1/3 text-lg">Game Name</h1>
        <input
          value={gameName}
          onChange={changeGameName}
          placeholder="Enter a name"
          className="p-2 rounded-2xl border-2 text-center"
        />
      </div>

      <div className="flex items-center">
        <h1 className="w-1/3 text-lg">Max Players</h1>
        <Slider 
          defaultValue={11}
          value={maxPlayers}
          onChange={changeTeamSize}
          track={false}
          marks={marks}
          min={14} max={22} step={2}
          color="neutral"
          sx={{
            width: 200,
            '.MuiSlider-mark': {height: 15, backgroundColor: '#16a34a'}
          }}
        />
      </div>

      <div className="flex items-center">
        <h1 className="w-1/3 text-lg">Price</h1>
        <input
          value={price}
          onChange={changePrice}
          placeholder="$0"
          className="p-2 rounded-2xl border-2 text-center w-20"
        />
      </div>
      <hr className="border-t border-gray-300 mb-4" style={{ marginBottom: "20px" }} />
      <div className="absolute bottom-0 right-20 p-4">
        <Button 
          onClick={handleSubmit} variant="contained" color="success" disableElevation 
        >
          Done
        </Button>
      </div>
    </div>
  )
}

export default ConfigureGame