import React, { useEffect, useState, useContext } from "react";
import { GameContext } from "./Organize"
import TouchableButton from "../components/TouchableButton";
import axios from "axios";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Slider from '@mui/material/Slider';
import { useNavigate } from 'react-router-dom';

const SelectTimeslot = () => {

  const { subfield, setGameData, setCurrStep } = useContext( GameContext )
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [day, setDay] = useState(new Date().toISOString())
  const [allSchedules, setAllSchedules] = useState([])
  const [daySchedule, setDaySchedule] = useState([])
  const [timeslots, setTimeslots] = useState([])
  const [duration, setDuration] = useState(60)
  const [gameStart, setGameStart] = useState('')
  const [gameEnd, setGameEnd] = useState('')
  const navigate = useNavigate()

  const changeDuration = (event, value) => {
    setDuration(value)
  } 

  const goPrevDay = () => {
    const localDate = new Date()
    const currDay = new Date(day)

    if (currDay.getDate() > localDate.getDate()){
      currDay.setDate(currDay.getDate() - 1)
      setDay(currDay.toISOString())
      setGameStart("")
    }
  }

  const goNextDay = () => {
    const currDay = new Date(day)
    currDay.setDate(currDay.getDate() + 1)
    setDay(currDay.toISOString())
    setGameStart("")
  }

  const handleSubmit = () => {
    if (gameStart){
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
    const getAllSchedules = async () => {
      const res = await axios.get(`api/get-subfield-schedules?subFieldId=${subfield.subFieldId}`)
      setAllSchedules(res.data)
    }
    if (subfield.subFieldId){
      getAllSchedules() 
    }
  }, [subfield])

  useEffect(() => {
    setDaySchedule(allSchedules.filter(schedule => 
      (day.slice(0, 10) >= schedule.startDate.slice(0, 10)) &&
      (day.slice(0, 10) <= schedule.endDate.slice(0, 10))
    ))
  }, [day, allSchedules])

  useEffect(() => {
    if (daySchedule.length > 0){
      const earliest = daySchedule.reduce((early, curr) => {
        return curr.startDate < early.startDate ? curr : early
      })
      const latest = daySchedule.reduce((late, curr) => {
        return curr.endDate > late.endDate ? curr : late
      })

      // Handle start dates before the selected day
      if (earliest.startDate.slice(0, 10) < day.slice(0, 10)){
        setStartDate(day.slice(0, 10) + "T00:00:00Z")
      }
      else{
        setStartDate(earliest.startDate) 
      }
  
      // Handle end dates after the selected day
      if (latest.endDate.slice(0, 10) > day.slice(0, 10)){
        setEndDate(day.slice(0, 10) + "T23:59:00Z")
      }
      else{
        setEndDate(latest.endDate)
      }
    }

  }, [daySchedule, day])

  useEffect(() => {
    const scheduleTimes = daySchedule.map(schedule => ({
      start: new Date(schedule.startDate),
      end: new Date(schedule.endDate)
    })) 

    const gameTimes = subfield.data ? 
      subfield.data.map(game => ({
        start: new Date(game.startDate),
        end: new Date(game.endDate)
      }))
      : []

    const slots = []
    let curr = new Date(startDate)
    const end = new Date(endDate)

    while (curr < end){
      let status = 0

      for (const times of scheduleTimes){
        if (curr >= times.start && curr < times.end){
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

      const localTime = new Date()
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
  }, [startDate, endDate, daySchedule, subfield.data])


  const handleSelect = (key) => {
    const numSlots = duration / 30

    if ((key + numSlots) > timeslots.length){
      return
    }
    else{
      let newSlots = timeslots.map(slot =>
        slot.status === 2 ? {...slot, status: 1 } : slot
      )

      const indices = []
      for (let i = 0; i < numSlots; i++){
        if (timeslots[key + i].status === 0){
          return
        }
        indices.push(key + i)
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
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex space-x-4 items-center">
          <div>
            <TouchableButton 
              twStyle="rounded-full bg-gray-300 p-1" 
              onClick={goPrevDay}
            >
              <ArrowBackIosNewIcon/>
            </TouchableButton>
          </div>

          <h1 className="my-4 text-xl text-center">{day.slice(0, 10)}</h1>

          <div>
            <TouchableButton 
              twStyle="rounded-full bg-gray-300 p-1" 
              onClick={goNextDay}
            >
              <ArrowForwardIosIcon />
            </TouchableButton>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <h1 className="text-md">Duration (min)</h1>
          <Slider 
            value={duration}
            onChange={changeDuration}
            marks min={30} max={180} step={30} 
            valueLabelDisplay="auto" 
            sx={{
              color: 'rgb(134 239 172)', width: 240,
              '.MuiSlider-mark': {height: 15, backgroundColor: 'rgb(134 239 172)'}
            }}
          />
        </div>

      </div>

      <div className="h-[50vh] overflow-scroll border-y-2 border-gray-500 py-1">
        { 
          timeslots.length > 0 ?
          timeslots.map((slot, index) => (
            <div className="flex px-6" key={index}>
              <h1 className="-translate-y-2 w-20">{slot.time.toLocaleString([], { hour: '2-digit', minute: '2-digit', timeZone:"UTC" })}</h1>
              <button 
                className={`flex-1 h-10 border-t border-x border-black ${slot.status === 1 ? "bg-gray-100" : (slot.status === 0 ? "bg-gray-400" : "bg-green-300")}`}
                onClick={() => handleSelect(index)}
              >
              </button>
            </div>
          )) :
          <h1 className="text-3xl text-center">No availablility on this day.</h1>
        }
      </div>
      <div className="absolute bottom-0 right-0 p-4">
        <TouchableButton
          onClick={handleSubmit}
          label="Done"
          twStyle="bg-green-300 rounded-md p-2"
        />
      </div>

    </div>
  )
}

export default SelectTimeslot