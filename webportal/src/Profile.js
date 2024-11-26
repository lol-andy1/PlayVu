import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import placeholderImage from  "./assets/profile.png"
import Dialog from '@mui/material/Dialog';
import GameCard from "./components/GameCard";
import { useAuth0 } from "@auth0/auth0-react";
// import { set } from "express/lib/application";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editPic, setEditPic] = useState(false);
  const {user} = useAuth0()
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const [newBio, setNewBio] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPic, setNewPic] = useState("")
  const [balance, setBalance] = useState("Loading...");

  const inputStyle = `w-3/5 text-center rounded-sm ${editing ? "outline outline-1 outline-neutral-300 focus:outline-green-400" : "focus:outline-none"}`
  const picIds = ["98", "19", "56", "35", "58", "91", "77", "42", "89", "44", "72", "85", "81", "21", "87", "41"]

  const openPicModal = () => {
    setEditPic(true)
  }
  const closePicModal = () => {
    setEditPic(false)
  }

  const changeBio = (event) => {
    setNewBio(event.target.value)
  }
  // const changeUsername = (event) => {
  //   setNewUsername(event.target.value)
  // }
  const changePic = (picId) => {
    setNewPic(`https://avatar.iran.liara.run/public/${picId}`)
    closePicModal()
  }

  const handleEdit = () => {
    if (editing){
      setNewUsername(userInfo.username)
      setNewBio(userInfo.bio)
      setNewPic(userInfo.profilePicture)
    }
    setEditing(!editing)
  }

  const saveChanges = async () => {
    const body = {
      username: newUsername,
      bio: newBio,
      profilePicture: newPic
    }
    await axios.post("/api/edit-user", body)
    setEditing(false)
    setUserInfo({username: newUsername, bio: newBio, profilePicture: newPic})
  }

  const getUser = async () => {
    try{
      setLoading(true)
      const res = await axios.get("/api/get-user")
      setUserInfo(res.data)
      const games = await axios.get("/api/get-user-games")
      setGames(games.data)

      setNewUsername(res.data.username)
      setNewBio(res.data.bio)
      setNewPic(res.data.profilePicture)
  
      setLoading(false)
    } catch (err){
      console.log(err)
    }

  }

  const getBalance = async () => {
    try{
      console.log(JSON.stringify({name: user.name}))
      const response = await fetch(baseURL+"/api/get-balance-of-account-from-username", {
        method: "POST",
    headers: {
        "Content-Type": "application/json", // Specify JSON format
    },
    body: JSON.stringify({name: user.name}),
    });
    const balance = await response.text();
    setBalance(balance);
    } catch (err){
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
    getBalance()
  }, [])

  return(
    <>
      <div className="flex flex-col">
        <div className="relative text-center py-2 w-full border-b border-gray-300">
          <h1 className="text-3xl font-semibold">Profile</h1>

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button onClick={handleEdit} disabled={loading} variant="outlined">
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col mt-2 text-center items-center justify-center space-y-4">
          <div
            className={`rounded-full w-36 ${editing && !newPic ? "opacity-30 outline outline-neutral-300" : ""}`}
            onClick={openPicModal}
            disabled={!editing}
          >
            <img
              src={newPic ? newPic : (userInfo.profilePicture ? userInfo.profilePicture : placeholderImage)}
              alt="Profile"
              className="rounded-full"
            />
          </div> 

          <input 
            className={`text-2xl font-semibold ${editing ? "text-gray-400" : "placeholder-black"} ${inputStyle}`}
            value={newUsername}
            // onChange={changeUsername}
            readOnly={!editing}
          />

          <input 
            className={`text-xl text-gray-400 ${inputStyle}`}
            value={newBio}
            placeholder={"Set a bio"}
            onChange={changeBio}
            readOnly={!editing}
          />

          <div className="flex flex-col bg-gray-100 rounded-xl shadow-xl max-w-fit p-10">
            <h1 className="text-2xl font-semibold">Balance</h1>
            <p className="text-4xl font-extrabold" style={{color: "#5433FF"}}>{"$" + balance/100}</p>
            <div className="flex flex-row items-center">
              <p>Powered by</p>
              <img src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg"></img>
            </div>
          </div>
        </div>

        <div className={`m-2 ${editing ? "" : "invisible"}`}>
          <Button onClick={saveChanges} color="success" variant="outlined">
            Save
          </Button>
        </div>


        <div className="border-t border-gray-300 text-center">
          <h1 className="py-2 text-2xl">Recent Games</h1>
          {games.length === 0 ? 
            <h1>No Recent Games</h1> :
            games.map(game => (
              <GameCard 
                key={game.gameId}
                id={game.gameId}
                name={game.name}
                startDate={game.startDate}
                endDate={game.endDate}
                playerCount={game.playerCount}
                max_players={game.maxPlayers}
                location={game.field + ", " + game.subfield}
                price={game.price}
              />
            ))
          }
        </div>

        <Dialog open={editPic} onClose={closePicModal}>
          <h1 className="text-center text-2xl">Choose Photo</h1>

          <div className="grid grid-cols-4 gap-2">
            {
              picIds.map((picId, index) => 
                <button key={index} onClick={() => changePic(picId)}>
                  <img src={`https://avatar.iran.liara.run/public/${picId}`} alt="Profile"/>
                </button>
              )
            }
          </div>
        </Dialog>
      </div>
    </>
  )
}

export default Profile