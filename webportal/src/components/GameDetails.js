import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button } from '@mui/material';
import Field from "./Field";
import { QRCode } from 'react-qrcode-logo';
import logo from  "../assets/logo.jpg"

const GameDetails = () => {
    const [reload, setReload] = useState(0); // This is used to know when to reload the page cause i cba to figure out how to do it in a different way
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
      }); // game data
    const navigate = useNavigate();
    const [isJoined, setIsJoined] = useState(false);
    // Get slug from route parameters
    const {slug} = useParams();
    useEffect(() => {
        // here put the axios request for game by id
        const getGameDetails = async () => {
          const userRes = await axios.get("/api/get-user")
          try{
            const res = await axios.get(`/api/get-game-data?gameId=${slug}`); // get data
            const data = res.data;
            console.log(data);
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
            }); // set data
            const isUserJoined =
              data.team_1.includes(userRes.data.username) ||
              data.team_2.includes(userRes.data.username) ||
              data.sideline.includes(userRes.data.username);
            setIsJoined(isUserJoined);
          }
          catch (err) {
            console.log(err)
          }
        }
        getGameDetails(); // actually do the thing we want it to do
    }, [reload]); // reload if reload is changed

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
        }
        catch (err) {
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
            <Field team1={game.team_1} team2={game.team_2}/>
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
              <span className="font-semibold">Sideline:</span> {game.sideline.length > 0 ? game.sideline.join(', ') : 'Sideline is currently empty'}
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
      </div>
    );
};

export default GameDetails; 