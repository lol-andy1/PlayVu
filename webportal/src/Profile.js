import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Profile = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const accessToken = await getAccessTokenSilently();
    const headers = {Authorization: `Bearer ${accessToken}`}
    const res = axios.get("http://localhost:8080/api/get-user", {headers})
    console.log(res)
  }
  return(
    <div>
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg" 
        alt="Profile Picture"
        className="w-32 rounded-full"
      />
    </div>
  )
}

export default Profile