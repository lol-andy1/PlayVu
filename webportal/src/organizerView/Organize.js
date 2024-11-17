import React, { createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import TouchableButton from "../components/TouchableButton";

export const GameContext = createContext()

const Organize = () => {
  const [gameData, setGameData] = useState({})
  const [subfield, setSubfield] = useState({})
  const [currStep, setCurrStep] = useState(-1)
  const navigate = useNavigate()
  
  const changeStep = (stepNum) =>{
    switch(stepNum){
      case 0: 
        navigate("/organize/select-field")
        break   
      case 1: 
        navigate("/organize/select-time")
        break 
      case 2: 
        navigate("/organize/configure")
        break     
      case 3: 
        navigate("/organize/confirm")
        break      
      default:
        break
    }
    setCurrStep(stepNum)
  }

  useEffect(() => {
    if (currStep === -1){
      navigate("/organize/games")
    }
  }, [currStep, navigate])

  const steps = ["Select Field", "Select Time", "Configure", "Confirm"]
  return (
    <GameContext.Provider value={{gameData, setGameData, subfield, setSubfield, currStep, setCurrStep}}>
      <div className="text-center py-2 border-b-2">
        <h1 className="text-3xl font-semibold mb-4">Organize Game</h1>
        {currStep >= 0 &&
          <div className="w-full p-2 my-2">
            <Stepper alternativeLabel activeStep={currStep} >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepButton 
                    onClick={() => changeStep(index)}
                  >  
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </div>
        }
      </div>
      <Outlet/>
      { currStep >= 0 &&
        <div className="absolute bottom-0 left-0 p-4">
          <TouchableButton
            label="Cancel"
            twStyle="bg-gray-300 rounded-md p-2"
          />
        </div>
      }
    </GameContext.Provider>
  )
}

export default Organize