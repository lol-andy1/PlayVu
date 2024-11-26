import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GameContext } from "./Organize"
import { useNavigate } from 'react-router-dom';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

const SelectTimeslot = () => {
  const { subfield, setGameData, setCurrStep } = useContext( GameContext )
  const navigate = useNavigate()

  const [gameStart, setGameStart] = useState('')
  const [gameEnd, setGameEnd] = useState('')
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [timeslots, setTimeslots] = useState()
  const [duration, setDuration] = useState(60)

  const changeDuration = (event, value) => {
    setDuration(value)
  } 

  const getDayOnly = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const goPrevDay = () => {
    const currDay = new Date(selectedDay)

    if (getDayOnly(currDay) > getDayOnly(new Date())){
      currDay.setDate(currDay.getDate() - 1)
      setSelectedDay(currDay)
      setGameStart("")
    }
  }

  const goNextDay = () => {
    const currDay = new Date(selectedDay)
    currDay.setDate(currDay.getDate() + 1)
    setSelectedDay(currDay)
    setGameStart("")
  }

  const handleSubmit = () => {
    if (gameStart && gameEnd){
      setGameData((prevData) => ({
        ...prevData, 
        startDate: gameStart,
        endDate: gameEnd
      }))

      navigate("/organize/configure")
      setCurrStep(2)
    }
  }

  useEffect(() => {
    const processSchedules = async () => {
      try{
        const res = await axios.get(`api/get-subfield-schedules?subFieldId=${subfield.subFieldId}`)

        if (res.data){
          res.data = res.data.map((schedule) => ({
            ...schedule,
            startDate: new Date(schedule.startDate),
            endDate: new Date(schedule.endDate)
          }))

          const day = getDayOnly(selectedDay)

          const daySchedules = res.data.filter(schedule => (
            day >= getDayOnly(schedule.startDate) &&
            day <= getDayOnly(schedule.endDate)
          ))

          if (daySchedules.length > 0){
            const earliest = daySchedules.reduce((early, curr) => {
              return curr.startDate < early.startDate ? curr : early
            })
            const latest = daySchedules.reduce((late, curr) => {
              return curr.endDate > late.endDate ? curr : late
            })
      
            // Handle start/end dates before/after the selected day
            const earliestDay = getDayOnly(earliest.startDate)
            let curr = (earliestDay < day) ?
              new Date(day) :
              new Date(earliest.startDate)
            
            const latestDay = getDayOnly(latest.endDate)
            const end = (latestDay > day) ?  
              new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 0) :
              new Date(latest.endDate)

            const gameTimes = subfield.data ? 
              subfield.data.map(game => ({
                start: new Date(game.startDate),
                end: new Date(game.endDate)
              })): []
            
            const localTime = new Date()
            const slots = []

            while (curr < end){
              let status = 0
        
              for (const schedule of daySchedules){
                if (curr >= schedule.startDate && curr < schedule.endDate){
                  status = 1
                  break
                }
              }
              for (const times of gameTimes){
                if (curr >= times.start && curr < times.end){
                  status = 0
                  break
                }
              }
        
              if (curr < localTime){
                status = 0
              }
        
              slots.push({
                "time": new Date(curr),
                "status": status
              })
              curr.setMinutes(curr.getMinutes() + 30);
            }
            setTimeslots(slots)
          }
          else{
            setTimeslots([])
          }
        }
      } catch (err){
        console.log(err)
      }
    }
    processSchedules()
  }, [selectedDay, subfield])

  const handleSelect = (index) => {
    const numSlots = duration / 30

    if ((index + numSlots) > timeslots.length){
      return
    }
    else{
      let newSlots = timeslots.map(slot =>
        slot.status === 2 ? {...slot, status: 1 } : slot
      )

      const indices = []
      for (let i = 0; i < numSlots; i++){
        if (timeslots[index + i].status === 0){
          return
        }
        indices.push(index + i)
      }
  
      indices.forEach(index => {
        newSlots[index].status = 2
      });

      setTimeslots(newSlots)
      setGameStart(newSlots[indices[0]].time.toISOString())
      
      const end = new Date(newSlots[indices[0]].time.toISOString())
      end.setMinutes(end.getMinutes() + duration)
      setGameEnd(end.toISOString())
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex space-x-1 items-center">
          <div>
            <IconButton onClick={goPrevDay}>
              <ArrowBackIosNewIcon/>
            </IconButton>
          </div>

          <h1 className="my-4 text-xl text-center">{selectedDay.toLocaleDateString()}</h1>

          <div>
            <IconButton onClick={goNextDay}>
              <ArrowForwardIosIcon/>
            </IconButton>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <h1 className="text-md">Duration (min)</h1>
          <Slider 
            value={duration}
            onChange={changeDuration}
            marks min={30} max={180} step={30} 
            valueLabelDisplay="auto" 
            color="neutral"
            sx={{
              width: 240,
              '.MuiSlider-mark': {height: 15, backgroundColor: '#16a34a'}
            }}
          />
        </div>
      </div>

      <div className="h-[50vh] overflow-scroll border-y-2 border-gray-500 pt-2">
        {timeslots ?
          (timeslots.length > 0 ?
            (timeslots.map((slot, index) => (
              <div className="flex space-x-2 px-6" key={index}>
                <h1 className="text-lg -translate-y-3 w-20">{index % 2 === 0 ? slot.time.toLocaleString([], { hour: '2-digit', minute: '2-digit'}): ""}</h1>
                <button 
                  className={`flex-1 h-10 border-t border-x border-black ${slot.status === 1 ? "bg-gray-100" : (slot.status === 0 ? "bg-gray-400" : "bg-[#16a34a]")}`}
                  onClick={() => handleSelect(index)}
                >
                </button>
              </div>
            ))) :
            <h1 className="text-3xl text-center">No availablility on this day.</h1> 
          ) :
          null
        }
      </div>

      <div className="absolute bottom-0 right-20 m-4">
        <Button 
          onClick={handleSubmit} disabled={!gameStart} variant="contained" color="success" disableElevation 
        >
          Done
        </Button>
      </div>
    </>
  )
}

export default SelectTimeslot