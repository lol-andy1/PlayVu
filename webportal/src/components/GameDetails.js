import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button, Dialog } from '@mui/material';
import Field from "./Field";
import { QRCode } from 'react-qrcode-logo';
import logo from  "../assets/logo.jpg"

const GameDetails = () => {
  const [reload, setReload] = useState(0); 
  const [game, setGame] = useState({
    name: '',
    location: '',
    player_count: null,
    max_players: null,
    price: null,
    field: '',
    date: '',
    team_1: [],
    team_2: [],
    sideline: []
  }); 
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [openManager, setOpenManager] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(false);

  const {slug} = useParams();
  useEffect(() => {
    const getGameDetails = async () => {
      try{
        const userRes = await axios.get("/api/get-user")
        const res = await axios.get(`/api/get-game-data?gameId=${slug}`); // get data
        const data = res.data;

        setGame({ 
          name: data.name,
          location: data.location,
          player_count: data.playerCount,
          max_players: data.max_players,
          price: data.price,
          field: data.sub_field_name,
          date: data.start_date,
          team_1: data.team_1,
          team_2: data.team_2,
          sideline: data.sideline
        });

        const isUserJoined =
          data.team_1.some((player) => player.username === userRes.data.username) ||
          data.team_2.some((player) => player.username === userRes.data.username) ||
          data.sideline.some((player) => player.username === userRes.data.username);

        setIsJoined(isUserJoined);
        setIsOrganizer(userRes.data.userId === res.data.organizer_id)
      } catch (err) {
        console.log(err)
      }
    }
    getGameDetails();
  }, [reload, slug]);

  const managePlayer = (player) => {
    if (isOrganizer){
      setSelectedPlayer(player)
      setOpenManager(true)
    }
  }

  const closeManager = () => {
    setOpenManager(false)
  }


  const joinGame = async () => {
    try {
      const res = await axios.post(`/api/join-game`, {
        gameId: slug,
        team: 0 // Start on the sideline
      });
      if (res.status === 200) {
        setIsJoined(true); // Set joined status to true
        setReload(!reload);
      }
    } catch (err) {
      console.error(err);
      alert("Error joining the game. Please try again.");
    }
  };

  // function takes team parameter, makes an API request, and if successful reloads the page
  const joinTeam = async (team) => {
    if(game.player_count >= game.max_players && team > 0) {
      alert('Game is full. Try joining sideline.') // Realistically this code should never happen
    }
    else {
      try {
        const res = await axios.post(`/api/join-game`, {
          gameId: slug,
          team: team
        })
        if (res.status === 200) {
          setReload(!reload);
        }
      } catch (err) {
        console.log(err);
        alert('Error joining. Please try again.')
      }
    }
  }

  const leaveGame = async () => {
    try {
      const res = await axios.post(`/api/leave-game`, {
        gameId: slug
      });
      if (res.status === 200) {
        setIsJoined(false); // Reset joined status
        setReload(!reload);
      }
    } catch (err) {
      console.error(err);
      alert("Failure to leave the game. Please try again.");
    }
  };
  const handleLeaveGame = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to leave the game? If you wish to rejoin the action later we suggest that you join the sideline instead"
    );
    if (userConfirmed) {
      leaveGame(); // Call the function to leave the game
    }
  };
    // game.player_count = game.max_players;
    // game.team_1 = [  "Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Moore", "Eve White",
    //     "Frank Harris", "Grace Clark"]

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-6">
      {/* Button placed above the card */}
      <div className="w-full max-w-md mb-4 px-4">
        <Button
          variant="contained"
          style={{ backgroundColor: '#14532d', color: '#ffffff' }} // Custom button color
          onClick={() => navigate(-1)} // Go back to the previous page
          className="w-full"
        >
          Back
        </Button>
      </div>

      <Card className="w-full max-w-md mx-4 shadow-lg mb-4">
        <CardContent>
          <Typography variant="h5" component="div" className="mb-4 text-center">
            {game.name || 'Game Title'}
          </Typography>
          <Field team1={game.team_1} team2={game.team_2} managePlayer={managePlayer}/>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Location:</span> {game.location || 'N/A'}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Players:</span> {game.player_count}/{game.max_players}
          </Typography>
          <Typography variant="body1" className="mb-2">
              <span className="font-semibold">Price:</span> {game.price !== null ? `$${game.price.toFixed(2)}` : 'Free'}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Field:</span> {game.field || 'N/A'}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Date:</span> {new Date(game.date).toLocaleString() || 'N/A'}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Team 1:</span> {game.team_1.length > 0 ? game.team_1.join(', ') : 'No players'}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Team 2:</span> {game.team_2.length > 0 ? game.team_2.join(', ') : 'No players'}
          </Typography>
          <Typography variant="body1" className="mb-2">
            <span className="font-semibold">Sideline:</span> {game.sideline.length > 0 ? game.sideline.map(player => player.username).join(', ') : 'Sideline is currently empty'}
          </Typography>
          {isJoined ? (
          <>
            <div className="flex justify-around mt-4">
              <Button
                variant="contained"
                style={{ backgroundColor: '#d32f2f', color: '#ffffff' }}
                onClick={() => joinTeam(1)}
              >
                Join Team 1
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#1976d2', color: '#ffffff' }}
                onClick={() => joinTeam(2)}
              >
                Join Team 2
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                onClick={() => joinTeam(0)}
              >
                Join Sideline
              </Button>
            </div>
          </>
          ) : (
          <div className="w-full max-w-md mt-4 px-4">
            <Button
              variant="contained"
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              onClick={joinGame}
              className="w-full"
            >
              Join Game
            </Button>
          </div>
          )}
        </CardContent>
      </Card>

      {isJoined && (
      <div className="w-full max-w-md mt-4 px-4">
        <Button
          variant="contained"
          style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
          onClick={handleLeaveGame}
          className="w-full"
        >
          Leave Game
        </Button>
      </div>
      )}

      <p style={{ fontSize: "16px", margin: "8px" }}>Share This Game:</p>
      <QRCode 
        value= {window.location.href}
        size={200}
        logoImage={logo}
        logoWidth={67}
        logoHeight={67}
      />

      <Dialog
        open={openManager} onClose={closeManager} 
      > 
        <div className="p-4 flex flex-col">
          <h1 className=" text-2xl border-b-2">Manage</h1>
          <h1 className=" text-xl">{selectedPlayer && selectedPlayer.username}</h1>
          <Button
            variant="contained"
            style={{ backgroundColor: '#d32f2f', color: '#ffffff', borderRadius: 0 }}
          >
            Move to Team 1
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#1976d2', color: '#ffffff', borderRadius: 0 }}
          >
            Move to Team 2
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#16a34a', color: '#ffffff', borderRadius: 0 }}
          >
            Move to Sideline
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#16a34a', color: '#ffffff', borderRadius: 0 }}
          >
            Substitute
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#d32f2f', color: '#ffffff', borderRadius: 0}}
          >
            Remove from game
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default GameDetails; 