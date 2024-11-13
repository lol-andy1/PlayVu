import React, { useEffect, useState } from "react";
import axios from "axios";
import TouchableButton from "./components/TouchableButton";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [newBio, setNewBio] = useState("")
  const [newUsername, setNewUsername] = useState("")

  const changeBio = (event) => {
    setNewBio(event.target.value)
  }
  const changeUsername = (event) => {
    setNewUsername(event.target.value)
  }

  const clearFields = () => {
    setNewBio('')
    setNewUsername('')
  }

  const saveChanges = async () => {
    const body = {
      username: newUsername,
      bio: newBio,
    }
    await axios.post("/api/edit-user", body)
    setEditing(false)
    await getUser()
    clearFields()
    console.log("post")
  }

  const inputStyle = `w-3/5 text-center rounded-sm ${editing ? "outline outline-1 outline-neutral-300 focus:outline-green-400" : "focus:outline-none"}`

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    setLoading(true)
    const res = await axios.get("/api/get-user")
    setUserInfo(res.data)
    setLoading(false)
    console.log("get")
  }

  const handleEdit = () => {
    if (editing){
      clearFields()
    }
    setEditing(!editing)
  }

  return(
    <>
        <div className="flex flex-col">
          <div className="relative text-center py-2 w-full border-b border-gray-300">
            <p className="text-3xl font-semibold">Profile</p>

            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <TouchableButton label={editing ? "Cancel" : "Edit"} onClick={handleEdit} disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col mt-2 text-center items-center justify-center space-y-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="Profile"
              className="w-36 rounded-full"
            />

            <input 
              className={`text-2xl font-semibold ${editing ? "" : "placeholder-black"} ${inputStyle}`}
              value={newUsername}
              placeholder={"@" + userInfo.username}
              onChange={changeUsername}
              readOnly={!editing}
            />

            <input 
              className={`text-xl ${inputStyle}`}
              value={newBio}
              placeholder={userInfo.bio ? userInfo.bio : "Set a bio"}
              onChange={changeBio}
              readOnly={!editing}
            />
          </div>

          <TouchableButton 
            label="Save" 
            style={`bg-green-400 mr-1 mt-2 ml-auto ${editing ? "" : "invisible"}`}
            onClick={saveChanges}
          />
  
          <div>Recent Games</div>
        </div>
    </>
  )
}

export default Profile