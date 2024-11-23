import React, {useContext, useEffect, useState} from "react";
import { GameContext } from "./Organize"
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import StripePayment from "../components/StripePayment";

const OrganizeConfirm = () => {
  const { gameData, subfield, setCurrStep  } = useContext( GameContext )
  const navigate = useNavigate()

  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [allowConfirmation, setAllowConfirmation] = useState(false)

  useEffect(() => {
    const s = new Date(gameData.startDate)
    const e = new Date(gameData.endDate)

    setDuration((e - s) / (1000 * 60 * 60))
  }, [gameData.startDate, gameData.endDate])

  const handleSubmit = async () => {
    try{
      setLoading(true)
      await axios.post("/api/add-game", gameData)
      setSuccess(true)
    } catch (err) {
      console.log(err)
    }
  }

  const exitOrganize = () => {
    if (success){
      navigate("/organize/games")
      setCurrStep(-1)
    }
  }

  return (
    <>
      <div className="overflow-y-auto text-xl space-y-4 mt-4">
        <h1 className="text-center text-3xl font-semibold">{gameData.name}</h1>

        <div className="flex">
          <h1 className="font-semibold w-1/3">Venue:</h1>
          <p className="w-full">{gameData.venue + ", " + subfield.name}</p>
        </div>

        <div className="flex">
          <h1 className="font-semibold w-1/3">Address:</h1>
          <p className="w-full">{gameData.location}</p>
        </div>

        <div className="flex">
          <h1 className="font-semibold w-1/3">Time:</h1>
          <p className="w-full">{new Date(gameData.startDate).toLocaleString()}</p>
        </div>

        <div className="flex">
          <h1 className="font-semibold w-1/3">Duration:</h1>
          <p className="w-full">{duration} hours</p>
        </div>

        <div className="flex">
          <h1 className="font-semibold w-1/3">Max Players:</h1>
          <p className="w-full">{gameData.maxPlayers}</p>
        </div>

        <div className="flex">
          <h1 className="font-semibold w-1/3">Entry Fee:</h1>
          <p className="w-full">${gameData.price ? gameData.price : 0}</p>
        </div>

        <div className="flex border-t-2">
          <h1 className="font-semibold w-1/3">Rental Cost:</h1>
          <p className="w-full">${duration * gameData.organizerCost}</p>
        </div>
      </div>

      <StripePayment setAllowConfirmation={setAllowConfirmation} amount={duration * gameData.organizerCost * 100} email={gameData.email} name={gameData.name} /> 
      
      <div className="flex absolute right-0 p-4 space-x-2">
        <Button  onClick={handleSubmit} variant="contained" color="success" disabled={!allowConfirmation} disableElevation>
          Confirm
        </Button>
      </div>

      <Backdrop open={loading} onClick={exitOrganize} sx={{zIndex: 10}}>
        {success ?
          <Alert severity="success" variant="filled">
            Game Created
          </Alert> :
          <CircularProgress /> 
        }
      </Backdrop>
    </>
  )
}

export default OrganizeConfirm