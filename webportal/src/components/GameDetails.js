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
import QrCodeIcon from '@mui/icons-material/QrCode';

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
  const [duration, setDuration] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [openManager, setOpenManager] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [currTime, setCurrTime] = useState(Date.now());
  const [substitute, setSubstitute] = useState(false);
  const [userId, setUserId] = useState();

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
        });

        const isUserJoined =
          data.team_1.some((player) => player.username === userRes.data.username) ||
          data.team_2.some((player) => player.username === userRes.data.username) ||
          data.sideline.some((player) => player.username === userRes.data.username);

        setIsJoined(isUserJoined);
        setIsOrganizer(userRes.data.userId === res.data.organizer_id)
        setUserId(userRes.data.userId)

        const startTime = new Date(data.start_date);
        const endTime = new Date(data.end_date);
        const diffInMs = endTime - startTime;

        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const formattedDuration = minutes === 0 
          ? `${hours} hours` 
          : `${hours} hours and ${minutes} minutes`;
        setDuration(formattedDuration);
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

  const handleSubstitute = async (player) => {
    try {
      const team = game.team_1.some((p) => p.userId === player.userId) ? 1 : 2

      await axios.post('api/switch-players', {
        gameId: slug,
        participantId1: player.userId,
        participantId2: selectedPlayer.userId,
        team: team
      })

      setReload(!reload);
      setOpenManager(false); 
      setSubstitute(false);
    } catch (err) {
      console.log(err)
    }
  }

  const removePlayer = async (userId) => {
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
      "Are you sure you want to leave the game? You will not be able to get a refund."
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
    <div className="flex flex-col items-center min-h-[80vh] bg-gray-100 pt-6">
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

      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent>
          <Typography variant="h5" component="div" className="mb-4 text-center">
            <Box className="flex justify-between">
              <IconButton
                onClick={() => setOpenQRModal(true)}
              >
                <QrCodeIcon />
              </IconButton>

              {game.name || 'Game Title'}
              
              <IconButton 
                onClick={refreshPage} 
                style={{ marginLeft: '8px', color: '#14532d' }} 
                aria-label="refresh"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Typography>

          <Box className="flex justify-between mx-2">
            <Typography variant="body1" className="text-center text-gray-600">
              {timeElapsed && canJoinGame 
                ? `Game started: ${timeElapsed}` 
                : 'Game has not started yet.'}
            </Typography>

            <Typography variant="body1" className="mb-2 text-gray-600">
              <span>Players:</span>{" "}
              {game.player_count}/{game.max_players}
            </Typography>
          </Box>

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
          <Box
            className="p-4 bg-gray-50 rounded-lg shadow-md"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <Typography variant="body1" className="mb-2">
              <span className="font-semibold text-gray-700">Location:</span>{" "}
              {game.location || "N/A"}
            </Typography>

            <Typography variant="body1" className="mb-2">
              <span className="font-semibold text-gray-700">Field:</span>{" "}
              {game.field || "N/A"}
            </Typography>

            <Typography variant="body1" className="mb-2">
              <span className="font-semibold text-gray-700">Price:</span>{" "}
              {game.price !== null ? `$${game.price.toFixed(2)}` : "Free"}
            </Typography>

            <Typography variant="body1" className="mb-2">
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              {new Date(game.start_date).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) || "N/A"}
            </Typography>

            <Typography>
              <span className="font-semibold text-gray-700">Game Length:</span>{" "}
              {duration || "Calculating..."}
            </Typography>
          </Box>
          {!isJoined && canJoinGame && (
            <div className="w-full max-w-md mt-4 px-4">
              <Button
                variant="contained"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                onClick={handleJoin}
                className="w-full"
              >
                Join Game
              </Button>
            </div>
          )}
          {isJoined && canJoinGame && (
          <>
            <div className="flex justify-around mt-4">
              <Button
                variant="contained"
                color="primary"
                sx={{ color: 'white' }}
                style={{ borderRadius: '5px 0 0 5px' }}
                onClick={() => joinTeam(1)}
                disabled={game.team_1.some(p => (p.userId === userId))}
              >
                Join Team 1
              </Button>

              <Button
                variant="contained"
                color="secondary"
                sx={{ color: 'white' }}
                style={{ borderRadius: 0 }}
                onClick={() => joinTeam(2)}
                disabled={game.team_2.some(p => (p.userId === userId))}
              >
                Join Team 2
              </Button>

              <Button
                variant="contained"
                color="neutral"
                sx={{ color: 'white' }}
                style={{ borderRadius: '0 5px 5px 0' }}
                onClick={() => joinTeam(0)}
                disabled={game.sideline.some(p => (p.userId === userId))}
              >
                Join Sideline
              </Button>
            </div>
          </>
          )}
          {isJoined && canJoinGame &&(
      <div className="w-full max-w-md mt-4 px-4">
        <Button
          variant="outlined"
          color="error"
          onClick={handleLeaveGame}
          className="w-full"
        >
          Leave Game
        </Button>
      </div>
      )}

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
                disabled={selectedPlayer.team === 1 || game.player_count === game.max_players}
                color="primary"
              >
                Team 1
              </Button>

              <Button
                onClick={() => joinTeam(2, selectedPlayer.userId)}
                disabled={selectedPlayer.team === 2 || game.player_count === game.max_players}
                color="secondary"
                style={{borderTop: "1px solid black", borderRadius: 0 }}
              >
                Team 2
              </Button>

              <Button
                color="neutral"
                onClick={() => joinTeam(0, selectedPlayer.userId)}
                disabled={selectedPlayer.team === 0}
                style={{ borderTop: "1px solid black", borderBottom: "1px solid black", borderRadius: 0  }}
              >
                Sideline
              </Button>

              <Button
                onClick={setSubstitute}
                disabled={selectedPlayer.team !== 0}
                color="warning"
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
      
      <Dialog open={Boolean(substitute)} onClose={() => setSubstitute(false)} >
        <div className="py-2 flex flex-col w-72">
          <h1 className="px-4">Replace</h1>
          <div className="flex flex-col overflow-auto max-h-96">
            {game.team_1.concat(game.team_2)
              .sort((a, b) => (
                (b.playTime + (currTime - Date.parse(b.playStart)) / 1000) - 
                (a.playTime + (currTime - Date.parse(a.playStart)) / 1000)
              ))
              .map((player, index) => (
                <div 
                  onClick={() => handleSubstitute(player)}
                  key={index} 
                  className={`px-4 py-2 text-xl border-t flex justify-between ${index % 2 === 0 ? "bg-gray-200" : ""}`}
                >
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

      <Dialog open={joinClicked && !allowConfirmation} onClose={() => setJoinClicked(false)}>
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
      
    </div>
  );
};

export default GameDetails; 