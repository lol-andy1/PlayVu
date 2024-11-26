import React, {useContext, useEffect, useState} from "react";
import { GameContext } from "./Organize"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import StripePayment from "../components/StripePayment";
import Dialog from '@mui/material/Dialog';

const OrganizeConfirm = () => {
  const { gameData, subfield, setCurrStep  } = useContext( GameContext )
  const navigate = useNavigate()
  const {user} = useAuth0()
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [payment, setPayment] = useState(false)
  const [username, setUsername] = useState("");

  const getUsername = async () => {
    try{
      // console.log(gameData.venue)
      const response = await fetch(baseURL+"/api/find-username-of-field-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fieldName: gameData.venue}),
      })
      const username = await response.text();
      setUsername(username);
    } catch (err) {
      console.log(err)
    }}

  useEffect(() => {
    const s = new Date(gameData.startDate)
    const e = new Date(gameData.endDate)

    setDuration((e - s) / (1000 * 60 * 60))
  }, [gameData.startDate, gameData.endDate])

  useEffect(() => {
    getUsername();
  },[baseURL]);

  const handleSubmit = async () => {
    try{
      setPayment(false)
      setLoading(true)
      await axios.post("/api/add-game", gameData)
      setSuccess(true)
    } catch (err) {
      console.log(err)
    }
  }

  const closePayment = () => {
    setPayment(false)
  }

  const exitOrganize = () => {
    if (success){
      navigate("/organize/games")
      setCurrStep(-1)
    }
  }

  return (
    <>
      <div className="p-4 bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto bg-white shadow-md text-md rounded-lg space-y-2 p-4">
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
      </div>
      <div className=" absolute right-20 bottom-0 p-4 ">
        <div onClick={setPayment}>
          <Button variant="contained" color="success" disableElevation>
            Confirm
          </Button>
        </div>
      </div>

      <Dialog open={payment.valueOf()} onClose={closePayment}>
        <StripePayment 
          setAllowConfirmation={handleSubmit} 
          amount={Math.round(duration * gameData.organizerCost * 100)} 
          email={"test@example.com"}
          name={"Test"} 
          receiver={username}
        />
      </Dialog>

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