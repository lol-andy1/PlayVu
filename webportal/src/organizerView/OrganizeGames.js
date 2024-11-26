import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./Organize";
import axios from "axios";

import Button from '@mui/material/Button';
import GameCard from "../components/GameCard";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const Organize = () => {
  const navigate = useNavigate()
  const { setCurrStep } = useContext(GameContext)

  const [upcomingGames, setUpcomingGames] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [gameToDelete, setGameToDelete] = useState()

  const createNewGame = () => {
    navigate("/organize/select-field")
    setCurrStep(0)
  }

  const getOrganizerGames = async () => {
    try{
      const res = await axios.get("/api/get-organizer-games")

      if (res.data.length > 0){
        res.data = res.data.map((game) => ({
          ...game,
          startDate: new Date(game.startDate),
          endDate: new Date(game.endDate),
        }))

        const upcoming = res.data.filter((game) => (
          Date.parse(game.endDate) > Date.now()
        ))
        upcoming.sort((a, b) => a.startDate - b.startDate)
        
        setUpcomingGames(upcoming)
      }
      
    } catch(err){
      console.log(err)
    }
  }

  const handleDelete = (game) => {
    setGameToDelete(game)
    setConfirmDelete(true)
  }

  const cancelDelete = () => {
    setConfirmDelete(false)
  }

  const deleteGame = async () => {
    try{
      await axios.post("/api/delete-game", {gameId: gameToDelete.gameId})
      setConfirmDelete(false)
      getOrganizerGames()
    } catch (err){
      console.log(err)
    }
  }

  useEffect(() => {
    getOrganizerGames()
  }, [])


  return (
    <div className="p-4 bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-center">
          <Button 
            onClick={createNewGame} variant="contained" color="neutral" sx={{ color: 'white'}} disableElevation 
          >
            Create New Game
          </Button>
        </div>

        <div className="">
          <h1 className="my-2 mx-4 text-lg">Upcoming</h1>

          <div className="overflow-scroll">
            {upcomingGames.slice(0, 4).map((game, index) => (
              <div key={index} className="flex relative justify-center">
                <GameCard
                  id={game.gameId}
                  name={game.name}
                  price={game.price}
                  startDate={game.startDate}
                  endDate={game.endDate}
                  playerCount={game.playerCount}
                  max_players={game.maxPlayers}
                  location={game.field + ", " + game.subfield}
                  picture={game.picture}
                />

                <div className="absolute right-1 top-1/4 p-2" onClick={() => handleDelete(game)}>
                  <DeleteIcon color="action"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={confirmDelete}>
        <DialogContent>
          Are you sure you want to delete {gameToDelete ? gameToDelete.name : "this game"}?
        </DialogContent>

        <DialogActions>
          <Button onClick={deleteGame} color="error">Yes</Button>
          <Button onClick={cancelDelete}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Organize