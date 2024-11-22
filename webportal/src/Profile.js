import React, { useEffect, useState } from "react";
import axios from "axios";
import TouchableButton from "./components/TouchableButton";
import placeholderImage from  "./assets/profile.png"
import Dialog from '@mui/material/Dialog';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editPic, setEditPic] = useState(false);

  const [newBio, setNewBio] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPic, setNewPic] = useState("")

  const inputStyle = `w-3/5 text-center rounded-sm ${editing ? "outline outline-1 outline-neutral-300 focus:outline-green-400" : "focus:outline-none"}`
  const picIds = ["98", "19", "56", "35", "58", "91", "77", "42", "89", "44", "72", "85", "81", "21", "87", "41"]
  const recentGames = []

  const openPicModal = () => {
    setEditPic(true)
  }
  const closePicModal = () => {
    setEditPic(false)
  }

  const changeBio = (event) => {
    setNewBio(event.target.value)
  }
  const changeUsername = (event) => {
    setNewUsername(event.target.value)
  }
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
    setLoading(true)
    const res = await axios.get("/api/get-user")
    setUserInfo(res.data)
    
    setNewUsername(res.data.username)
    setNewBio(res.data.bio)
    setNewPic(res.data.profilePicture)

    setLoading(false)
  }

  useEffect(() => {
    getUser()
  }, [])

  return(
    <>
      <div className="flex flex-col">
        <div className="relative text-center py-2 w-full border-b border-gray-300">
          <h1 className="text-3xl font-semibold">Profile</h1>

          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <TouchableButton label={editing ? "Cancel" : "Edit"} onClick={handleEdit} disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col mt-2 text-center items-center justify-center space-y-4">
          <button 
            className={`rounded-full w-36 ${editing && !newPic ? "opacity-30 outline outline-neutral-300" : ""}`}
            onClick={openPicModal}
            disabled={!editing}
          >
            <img
              src={newPic ? newPic : (userInfo.profilePicture ? userInfo.profilePicture : placeholderImage)}
              alt="Profile"
              className="rounded-full"
            />
          </button> 

          <input 
            className={`text-2xl font-semibold ${editing ? "text-gray-400" : "placeholder-black"} ${inputStyle}`}
            value={newUsername.startsWith('@') ? newUsername : "@" + newUsername}
            onChange={changeUsername}
            readOnly={!editing}
          />

          <input 
            className={`text-xl text-gray-400 ${inputStyle}`}
            value={newBio}
            placeholder={"Set a bio"}
            onChange={changeBio}
            readOnly={!editing}
          />
        </div>

        <TouchableButton 
          label="Save" 
          style={`bg-green-400 mr-1 mt-2 ml-auto ${editing ? "" : "invisible"}`}
          onClick={saveChanges}
        />

        <div className="border-t border-gray-300 text-center">
          <h1 className="py-2 text-2xl">Recent Games</h1>
          {
            recentGames.length === 0 ? 
            <h1>No Recent Games</h1> : ""
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