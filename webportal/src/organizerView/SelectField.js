import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import FieldCard from "../components/FieldCard";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import SubfieldCard from "../components/SubfieldCard";
import { GameContext } from "./Organize"
import { useNavigate } from 'react-router-dom';

const SelectField = () => {

  const searchbarRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debounceVal, setDebounceVal] = useState("")
  const [fields, setFields] = useState()
  const {setSubfield, setCurrStep, setGameData} = useContext(GameContext)
  const navigate = useNavigate()

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  } 

  const selectSubfield = (field, subfield) => {
    setGameData((prevData) => ({
      ...prevData,
      venue: field.fieldName,
      location: field.address + " " + field.city + " " + field.zipCode,
      subFieldId: subfield.subFieldId
  }))
    setSubfield(subfield)
    navigate('/organize/select-time');
    setCurrStep(1)
  }

  useEffect(() => {
    searchbarRef.current.focus();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounceVal(searchQuery)
    }, 500)

    return (
      () => clearTimeout(timeoutId)
    )
  }, [searchQuery])

  useEffect(() => { 
    const getFieldsByName = async () => {
      const res = await axios.get(`/api/get-fields-by-name?name=${debounceVal}`)
      setFields(res.data)
    }
    if (debounceVal && debounceVal.length > 2){
      getFieldsByName()
    }
  }, [debounceVal])

  return (
    <>
      <div className="flex justify-center py-2 mt-4">
        <input
          ref={searchbarRef}
          placeholder="Search venues by name"
          className="p-2 rounded-2xl border-2 w-3/5 text-lg"
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
      {
        fields && (
          fields.length > 0 ?
          fields.map((field) => (
            <div key={field.fieldId}>
              <Accordion disableGutters={true} elevation={0} expanded={field.subFields.length? undefined : false}> 
                <AccordionSummary 
                  id={field.fieldId} 
                  sx={{".MuiAccordionSummary-content": {marginY: 0.5}}}
                >
                  <FieldCard field={field}/>
                </AccordionSummary>
                <AccordionDetails sx={{paddingTop: 0, paddingBottom: 1}}>
                  {
                    field.subFields &&
                    field.subFields.map((subfield, index) =>
                      <div key={index} className="mb-1">
                        <button className="w-full" onClick={() => selectSubfield(field, subfield)}>
                          <SubfieldCard subfield={subfield}/>
                        </button>
                      </div>
                    )
                  }
                </AccordionDetails>
              </Accordion>
            </div>
          )) :
          <h1 className="text-center text-xl">No results</h1>
        )
      }
    </>
  )
}

export default SelectField