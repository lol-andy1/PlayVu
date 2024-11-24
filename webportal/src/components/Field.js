import field from './../assets/field.jpg'
import { Box } from '@mui/material'

const Field = ({team1, team2, managePlayer}) => {
    // team1 = [  "Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Moore", "Eve White",
    //     "Frank Harris", "Grace Clark"]
    // team2 = ["Edward", "Felicia", "Gerard", "Howard", "Eve White",
    //     "Frank Harris", "Grace Clark"]
    team1.slice(0,15);
    team2.slice(0,15);

    const isTeam2 = (left) => parseFloat(left) < 50;

    const team1_positions = [
        {top: '50%', left: '40%'},
        {top: '30%', left: '40%'},
        {top: '70%', left: '40%'},
        {top: '10%', left: '40%'},
        {top: '90%', left: '40%'},
        {top: '50%', left: '25%'},
        {top: '30%', left: '25%'},
        {top: '70%', left: '25%'},
        {top: '10%', left: '25%'},
        {top: '90%', left: '25%'},
        {top: '50%', left: '10%'},
        {top: '30%', left: '10%'},
        {top: '70%', left: '10%'},
        {top: '10%', left: '10%'},
        {top: '90%', left: '10%'},
    ];

    const team2_positions = [
        {top: '50%', left: '60%'},
        {top: '30%', left: '60%'},
        {top: '70%', left: '60%'},
        {top: '10%', left: '60%'},
        {top: '90%', left: '60%'},
        {top: '50%', left: '75%'},
        {top: '30%', left: '75%'},
        {top: '70%', left: '75%'},
        {top: '10%', left: '75%'},
        {top: '90%', left: '75%'},
        {top: '50%', left: '90%'},
        {top: '30%', left: '90%'},
        {top: '70%', left: '90%'},
        {top: '10%', left: '90%'},
        {top: '90%', left: '90%'},
    ];

    return(
        <Box className="relative">
        <img
          src={field} // Replace with your image source
          alt="field"
          className="w-full h-auto object-cover"
        />
        
        {team1.map((player, index) => (
          <div
            key={index}
            className={`absolute rounded-full flex items-center justify-center ${
              isTeam2(team1_positions[index].left) ? 'bg-red-500' : 'bg-blue-500'
            } w-10 h-10`} // Constant circle size 10px
            style={{
              top: team1_positions[index].top,
              left: team1_positions[index].left,
              transform: 'translate(-50%, -50%)', // Center the circle relative to the position
            }}
          > 
            <span className="text-white text-[10px] text-center" onClick={() => managePlayer(player)}>
              {player.username}
            </span>
          </div>
        ))}

        {team2.map((player, index) => (
          <div
            key={index}
            className={`absolute rounded-full flex items-center justify-center ${
              isTeam2(team2_positions[index].left) ? 'bg-red-500' : 'bg-blue-500'
            } w-10 h-10`} // Constant circle size 10px
            style={{
              top: team2_positions[index].top,
              left: team2_positions[index].left,
              transform: 'translate(-50%, -50%)', // Center the circle relative to the position
            }}
          >
            <span className="text-white text-[10px] text-center" onClick={() => managePlayer(player)}>
              {player.username}
            </span>
          </div>
        ))}
      </Box>
    );
}
export default Field;