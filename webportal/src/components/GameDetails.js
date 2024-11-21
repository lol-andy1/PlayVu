import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button } from '@mui/material';
import Field from "./Field";

const GameDetails = () => {
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

    // Get slug from route parameters
    const {slug} = useParams();

    useEffect(() => {
        // here put the axios request for game by id
        const getGameDetails = async () => {
          try{
                const res = await axios.get(`/api/get-game-data?gameId=${slug}`);
                const data = res.data;
                console.log(data);
                setGame({
                    name: data.name,
                    location: data.location,
                    player_count: data.playerCount,
                    max_players: data.max_players,
                    price: data.price,
                    field: data.sub_field_name,
                    date: data.timezone,
                    team_1: data.team_1,
                    team_2: data.team_2,
                    sideline: data.sideline
                  });
          }
          catch (err) {
                console.log(err)
          }
        }
        getGameDetails();
    }, [game]);

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
            alert(`Successfully joined ${team === 1 ? 'Team 1' : team === 2 ? 'Team 2' : 'the Sideline'}!`);
            try {
              const response = axios.get(`/api/get-game-data?gameId=${slug}`);
              const data = response.data;
              setGame({
                name: data.name,
                location: data.location,
                player_count: data.playerCount,
                max_players: data.max_players,
                price: data.price,
                field: data.sub_field_name,
                date: data.timezone,
                team_1: data.team_1,
                team_2: data.team_2,
                sideline: data.sideline
              });
            } catch (error) {
              console.log(error);
            }
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
        const res = await axios.post(`api/leave-game`, {
          gameId: slug
        })
        if (res.status === 200) {
          alert(`Successfully left game!`);
          try {
            const response = axios.get(`/api/get-game-data?gameId=${slug}`);
            const data = response.data;
            setGame({
              name: data.name,
              location: data.location,
              player_count: data.playerCount,
              max_players: data.max_players,
              price: data.price,
              field: data.sub_field_name,
              date: data.timezone,
              team_1: data.team_1,
              team_2: data.team_2,
              sideline: data.sideline
            });
          } catch (error) {
            console.log(error);
          }
        }
      } catch (err) {
        console.log(err);
        alert('Failure to leave game. Please try again.')
      }
    }

    // game.player_count = game.max_players;

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
            <div className="flex justify-around mt-4">
              {game.player_count < game.max_players ? (
                <>
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
                </>
              ) : (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#14532d', color: '#ffffff' }}
                    onClick={() => joinTeam(0)}
                  >
                    Join Sideline
                  </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="w-full max-w-md mt-4 px-4">
          <Button
            variant="contained"
            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
            onClick={leaveGame}
            className="w-full"
          >
            Leave Game
          </Button>
        </div>
      </div>
    );
};

export default GameDetails; 