import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button, Dialog, Box, DialogActions, DialogContent } from '@mui/material';
import Field from "./Field";
import { QRCode } from 'react-qrcode-logo';
import logo from  "../assets/logo.jpg"
import StripePayment from "./StripePayment";
import { useAuth0 } from "@auth0/auth0-react";
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton'

const GameDetails = () => {
  const navigate = useNavigate();
  const [reload, setReload] = useState(0); 
  const [game, setGame] = useState({
    name: '',
    location: '',
    player_count: null,
    max_players: null,
    price: null,
    field: '',
    start_date: '',
    end_date: '',
    team_1: [],
    team_2: [],
    sideline: []
  }); 
  const [isJoined, setIsJoined] = useState(false);
  const [allowConfirmation, setAllowConfirmation] = useState(false)
  const [joinClicked, setJoinClicked] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState('');
  const [openQRModal, setOpenQRModal] = useState(false);

  const [isOrganizer, setIsOrganizer] = useState(false);
  const [openManager, setOpenManager] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [currTime, setCurrTime] = useState(Date.now());
  const [substitute, setSubstitute] = useState(false);

  const {slug} = useParams();
  const {user} = useAuth0();
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
          start_date: data.start_date,
          end_date: data.end_date,
          team_1: data.team_1,
          team_2: data.team_2,
          sideline: data.sideline,
          startDate: new Date(data.start_date)
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

  useEffect(() => {
    if (allowConfirmation) {
      joinGame();
      // setJoinClicked(false);
      // setAllowConfirmation(false);
    }
  }, [allowConfirmation]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (game.start_date) {
        const startTime = new Date(game.start_date).getTime();
        const currentTime = Date.now();
        if (currentTime > startTime) {
          const elapsedTime = currentTime - startTime;

          const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
          const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  
          setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`);
        }
        else {
          setTimeElapsed('');
        }
      }
    }, 1000)

    return () => clearInterval(interval);
  }, [game])

  const managePlayer = (player) => {
    if (isOrganizer){
      setCurrTime(Date.now())
      setSelectedPlayer(player)
      setOpenManager(true)
    }
  }

  const closeManager = () => {
    setOpenManager(false)
    setSubstitute(false)
  }

  const removePlayer = async (userId) => {
    if (isOrganizer){
      try {
        await axios.post('/api/remove-player', {
          gameId: slug,
          participantId: userId
        });
        setReload(!reload);
        setOpenManager(false);  
      } catch (err) {
        console.error(err);
      }
    }
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
  const joinTeam = async (team, userId) => {
    if(game.player_count >= game.max_players && team > 0) {
      alert('Game is full. Try joining sideline.') // Realistically this code should never happen
    }
    else {
      try {
        const res = await axios.post(`/api/join-game`, {
          gameId: slug,
          team: team,
          participantId: userId,
          playStart: new Date().toISOString()
        })
        if (res.status === 200) {
          setReload(!reload);
          setOpenManager(false);
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

  const refreshPage = () => {
    setReload(!reload);
  }

  const handleJoin = () => {
    setJoinClicked(true);
    if(game.price === 0) {
      setAllowConfirmation(true);
    }
    else {
      setAllowConfirmation(false);
    }
  }

  // if(game.price === 0 && !allowConfirmation) {
  //   setAllowConfirmation(true);
  // }

  // const handleJoinGame = () => {
  //   setAllowConfirmation(false);
  //   setJoinClicked(true);
  // };

  const currentTime = Date.now();
  const gameEndTime = new Date(game.end_date).getTime();
  const canJoinGame = currentTime < gameEndTime;
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
            <IconButton 
              onClick={refreshPage} 
              style={{ marginLeft: '8px', color: '#14532d' }} 
              aria-label="refresh"
            >
              <RefreshIcon />
            </IconButton>
          </Typography>
          <Typography variant="body2" className="text-center text-gray-600">
            {timeElapsed 
              ? `Game started. Time passed: ${timeElapsed}` 
              : 'Game has not started yet.'}
          </Typography>
          <Typography variant="body2" className="text-center text-gray-600">
            {timeElapsed 
              ? `Game started. Time passed: ${timeElapsed}` 
              : 'Game has not started yet.'}
          </Typography>

          <Field team1={game.team_1} team2={game.team_2} managePlayer={managePlayer}/>

          <Box className="w-full bg-gray-200 py-4 flex justify-center gap-4 flex-wrap">
            {game.sideline.map((player, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
              >
                <span className="text-black text-[10px] text-center truncate" onClick={() => managePlayer({...player, team: 0})}>{player.username}</span>
              </div>
            ))}
          </Box>

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
            <span className="font-semibold">Date:</span> {new Date(game.start_date).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) || 'N/A'}
          </Typography>
          {!isJoined && canJoinGame && (
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
          {isJoined && (
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
          )}
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

      <div className="w-full max-w-md mt-4 px-4">
        <Button
          variant="contained"
          style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
          onClick={() => setOpenQRModal(true)}
          className="w-full"
        >
          Share This Game
        </Button>
      </div>

      <Dialog open={openQRModal} onClose={() => setOpenQRModal(false)}>
        <DialogContent>
          <Typography variant="h6" className="text-center mb-4">Scan to Share This Game</Typography>
          <QRCode 
            value={window.location.href}
            size={200}
            logoImage={logo}
            logoWidth={50}
            logoHeight={50}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </CardContent>
      </Card>

      <Dialog open={openManager && !substitute} onClose={closeManager}> 
        <div className="p-4 flex flex-col w-72">
          <h1 className="text-xl pb-2 border-b-2">Manage {selectedPlayer && selectedPlayer.username}</h1>

          <div>
            <span>Play time: </span>
            <span>
              {(Math.round(
                selectedPlayer.playTime ? 
                (selectedPlayer.playTime + 
                  (selectedPlayer.team !== 0 ? 
                    (currTime - Date.parse(selectedPlayer.playStart)) / 1000 
                    : 0
                  )
                ) / 60 
                : 0
              ))  + " min"}
            </span>
          </div>
          
          <div>
            <h1 className="mt-2">Move Player</h1>

            <div className="flex flex-col mb-4 border border-black rounded-lg bg-gray-100">
              <Button
                onClick={() => joinTeam(1, selectedPlayer.userId)}
                style={{ color: '#1976d2' }}
              >
                Team 1
              </Button>

              <Button
                onClick={() => joinTeam(2, selectedPlayer.userId)}
                style={{ color: '#16a34a', borderTop: "1px solid black", borderRadius: 0 }}
              >
                Team 2
              </Button>

              <Button
                color="warning"
                onClick={() => joinTeam(0, selectedPlayer.userId)}
                style={{ borderTop: "1px solid black", borderBottom: "1px solid black", borderRadius: 0  }}
              >
                Sideline
              </Button>

              <Button
                onClick={setSubstitute}
                disabled={selectedPlayer.team !== 0}
              >
                Substitute
              </Button>
            </div>
          </div>
          <Button
            onClick={() => removePlayer(selectedPlayer.userId)}
            variant="outlined"
            color="error"
            style={{ borderColor: "black", backgroundColor: '#f3f4f6'}}
          >
            Remove
          </Button>
        </div>
      </Dialog>
      
      <Dialog open={substitute} onClose={() => setSubstitute(false)}>
        <div className="py-2 flex flex-col w-72">
          <h1 className="px-4">Replace</h1>
          <div className="flex flex-col">
            {game.team_1.concat(game.team_2)
              .sort((a, b) => (
                (b.playTime + (currTime - Date.parse(b.playStart)) / 1000) - 
                (a.playTime + (currTime - Date.parse(a.playStart)) / 1000)
              ))
              .map((player, index) => (
                <div className={`px-4 py-2 text-xl border-t flex justify-between ${index % 2 === 0 ? "bg-gray-200" : ""}`}>
                  <span>{player.username}</span>
                  <span>
                    {(Math.round(
                      (player.playTime + 
                        (player.team !== 0 ? 
                          (currTime - Date.parse(player.playStart)) / 1000 
                          : 0
                        )
                      ) / 60 
                    )) + 
                    " min"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </Dialog>

      {joinClicked && !allowConfirmation && (
        <Dialog open={true}>
          <StripePayment
            setAllowConfirmation={(status) => {
              setAllowConfirmation(status);
              if (status) {
                setJoinClicked(false);
              }
            }}
            amount={game.price * 100}
            email={user.email}
            name={user.name}
          />
        </Dialog>
      )}
    </div>
  );
};

export default GameDetails; 