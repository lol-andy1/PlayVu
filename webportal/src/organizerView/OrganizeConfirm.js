import React, {useContext, useEffect, useState} from "react";
import TouchableButton from "../components/TouchableButton";
import { GameContext } from "./Organize"
import axios from "axios";



const OrganizeConfirm = () => {
  const { gameData, subfield } = useContext( GameContext )

  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const s = new Date(gameData.startDate)
    const e = new Date(gameData.endDate)

    setDuration((e - s) / (1000 * 60 * 60))
  }, [gameData.startDate, gameData.endDate])

  const handleSubmit = async () => {
    try{
      console.log(gameData)
      const res = await axios.post("/api/add-game", gameData)
      console.log(res)
    } catch (err) {
    }
  }

  return (
    <>
      <div className="text-xl space-y-4 mt-4">
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
          <p className="w-full">{new Date(gameData.startDate).toUTCString()}</p>
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
          <h1 className="font-semibold w-1/3">Price:</h1>
          <p className="w-full">${gameData.price}</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 p-4">
        <TouchableButton
          onClick={handleSubmit}
          label="Confirm"
          twStyle="bg-green-300 rounded-md p-2 font-semibold"
        />
      </div>
    </>
  )
}

export default OrganizeConfirm