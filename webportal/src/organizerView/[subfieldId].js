import React, { useEffect, useState, useContext } from "react";
import { GameContext } from "./Organize"
import TouchableButton from "../components/TouchableButton";

const SelectTimeslot = () => {

  const { subfield } = useContext( GameContext )
  const [startDate, setStartDate] = useState(new Date("2024-11-15T12:00:00"))
  const [endDate, setEndDate] = useState(new Date("2024-11-15T20:00:00"))

  useEffect(() => {
    let start = new Date("2024-11-15T10:00:00")
    const end = new Date("2024-11-15T20:00:00")
    const slots = []
    while (start < end){
      slots.push({
        "time": new Date(start),
        "status": 0
      })
      subfield.data.forEach((game) => {
        if (start >= new Date(game.startDate) && start < new Date(game.endDate)){
          console.log(game.startDate)

          slots[slots.length - 1].status = 1
        } 
      })

      start.setMinutes(start.getMinutes() + 30);
    }
    setTimeslots(slots)
    console.log(subfield.data)
  }, [subfield])

  const [timeslots, setTimeslots] = useState([])

  const handleSelect = (key) => {
    if ((key + 2) > timeslots.length){
      return
    }
    else{
      let newSlots = timeslots.map(slot =>
        slot.status === 2 ? {...slot, status: 0 } : slot
      )

      const indices = []
      for (let i = 0; i < 2; i++){
        if (timeslots[key + i].status === 1){
          return
        }
        indices.push(key + i)
      }
  
      indices.forEach(index => {
        newSlots[index].status = 2
      });

      setTimeslots(newSlots)
    }
  }

  return (
    <div className="flex flex-col">
      <h1 className="my-4 text-xl text-center">{startDate.toLocaleDateString()}</h1>
      <div className="h-[65vh] overflow-scroll">
        {
          timeslots.map((slot, index) => (
            <div className="flex px-2" key={index}>
              <h1 className="-translate-y-2 w-20">{slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
              <button 
                className={`flex-1 h-10 border-t border-black ${slot.status === 0 ? "" : (slot.status === 1 ? "bg-gray-500" : "bg-green-300")}`}
                onClick={() => handleSelect(index)}
              >
              </button>
            </div>
          ))
        }
      </div>

      <TouchableButton
        label="Done"
        style="bg-green-300"
      />
    </div>
  )
}

export default SelectTimeslot