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
    {value: 7, label: "7"},
    {value: 8, label: "8"},
    {value: 9, label: "9"},
    {value: 10, label: "10"},
    {value: 11, label: "11"},
  ]

  const changeGameName = (event) => {
    setGameName(event.target.value)
  } 
  const changeTeamSize = (event) => {
    setMaxPlayers(event.target.value * 2)
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
        <h1 className="w-1/3 text-lg">Team Size</h1>
        <Slider 
          defaultValue={11}
          value={maxPlayers / 2}
          onChange={changeTeamSize}
          track={false}
          marks={marks}
          min={7} max={11}  
          sx={{
            color: 'rgb(134 239 172)', width: 200,
            '.MuiSlider-mark': {height: 15, backgroundColor: 'rgb(134 239 172)'}
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

      <div className="absolute bottom-0 right-0 p-4">
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