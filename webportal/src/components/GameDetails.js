import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const GameDetails = () => {
    const [game, setGame] = useState([]);
    const navigate = useNavigate();

    // Get slug from route parameters
    const {slug} = useParams();

    useEffect(() => {
        // here put the axios request for game by id
        const getGameDetails = async () => {
            try{
                const res = await axios.get(`/api/get-game-data?gameId=${slug}`);
                console.log(res);
            }
            catch (err) {
                console.log(err)
            }
        }
    })
}

export default GameDetails; 