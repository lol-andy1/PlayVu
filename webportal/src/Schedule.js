import React, { useState, useCallback, useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "@bitnoi.se/react-scheduler/dist/style.css";
import styled from "styled-components";
import axios from "axios";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.tz.setDefault(dayjs.tz.guess());

export const StyledSchedulerFrame = styled.div`
  position: relative;
  height: 60vh;
  width: 100%;
`;

const AssignAvailabilities = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [selectedSubfieldId, setSelectedSubfieldId] = useState("");
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [availabilityForm, setAvailabilityForm] = useState({
    subfieldId: "",
    startDate: "",
    endDate: "",
  });
  const [gameDetails, setGameDetails] = useState({
    maxPlayers: null,
    price: null,
    playerCount: 0,
    location: "",
    organizerEmail: "",
    organizerProfilePicture: null,
    name: "",
  });
  const [schedulerData, setSchedulerData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [filteredSchedulerData, setFilteredSchedulerData] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get("/api/get-owner-fields");
        const transformedFields = response.data.map((field) => ({
          fieldId: field.fieldId.toString(),
          label: { title: field.fieldName },
          subfields: field.subFields.map((subField) => ({
            id: subField.subFieldId.toString(),
            label: { title: subField.name },
            data: [],
          })),
        }));
        setFields(transformedFields);
        if (transformedFields.length > 0) {
          fetchSchedules(transformedFields[0]);
          setSelectedFieldId(transformedFields[0].fieldId);
          setSelectedSubfieldId(transformedFields[0].subfields[0]?.id || "");
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    fetchFields();
  }, []);

  useEffect(() => {}, [schedulerData]);

  useEffect(() => {
    const updatedFilteredData = schedulerData
      .filter((field) => field.fieldId === selectedFieldId)
      .flatMap((field) => field.subfields)
      .map((subfield) => ({
        ...subfield,
        data: subfield.data.filter(
          (event) =>
            dayjs(event.startDate).isBetween(range.startDate, range.endDate) ||
            dayjs(event.endDate).isBetween(range.startDate, range.endDate) ||
            (dayjs(event.startDate).isBefore(range.startDate) &&
              dayjs(event.endDate).isAfter(range.endDate))
        ),
      }));

    setFilteredSchedulerData(updatedFilteredData);
  }, [schedulerData, range, selectedFieldId]);

  const fetchSchedules = async (field) => {
    try {
      const response = await axios.get(
        `/api/get-field-schedules?fieldId=${field.fieldId}`
      );
      const updatedFields = [
        {
          ...field,
          subfields: field.subfields.map((subfield) => {
            const scheduleData = response.data.find(
              (schedule) => schedule.subFieldId.toString() === subfield.id
            );
            return {
              ...subfield,
              data: scheduleData
                ? scheduleData.data.map((event) => {
                    if (event.type === "schedule") {
                      return {
                        id: event.fieldScheduleId,
                        type: event.type,
                        startDate: dayjs(event.startDate).toDate(),
                        endDate: dayjs(event.endDate).toDate(),
                        title: "Available",
                        description: `From ${dayjs(
                          event.startDate
                        ).toDate()} to ${dayjs(event.endDate).toDate()}`,
                        bgColor: `rgb(85, 0, 220)`,
                      };
                    } else if (event.type === "game") {
                      return {
                        id: event.gameId,
                        type: event.type,
                        startDate: dayjs(event.startDate).toDate(),
                        endDate: dayjs(event.endDate).toDate(),
                        title: "Game",
                        description: `From ${dayjs(
                          event.startDate
                        ).toDate()} to ${dayjs(event.endDate).toDate()}`,
                        bgColor: `rgb(0, 193, 86)`,
                      };
                    }
                  })
                : [],
            };
          }),
        },
      ];
      setSchedulerData(updatedFields);

      const updatedFilteredData = updatedFields
        .filter((field) => field.fieldId === field.fieldId)
        .flatMap((field) => field.subfields)
        .map((subfield) => ({
          ...subfield,
          data: subfield.data.filter(
            (event) =>
              dayjs(event.startDate).isBetween(
                range.startDate,
                range.endDate
              ) ||
              dayjs(event.endDate).isBetween(range.startDate, range.endDate) ||
              (dayjs(event.startDate).isBefore(range.startDate) &&
                dayjs(event.endDate).isAfter(range.endDate))
          ),
        }));

      setFilteredSchedulerData(updatedFilteredData);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleFieldChange = (e) => {
    const fieldId = e.target.value;
    setSelectedFieldId(fieldId);
    const selectedField = fields.find((field) => field.fieldId === fieldId);
    setSelectedSubfieldId(selectedField?.subfields[0]?.id || "");
    fetchSchedules(selectedField);
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/add-field-schedule", {
        subFieldId: selectedSubfieldId,
        startDate: dayjs(availabilityForm.startDate).toDate(),
        endDate: dayjs(availabilityForm.endDate).toDate(),
      });

      if (response.status === 200 || response.status === 201) {
        setIsAddModalOpen(false);
        fetchSchedules(
          fields.find((field) => field.fieldId === selectedFieldId)
        );
      } else {
        console.error("Failed to add schedule on the server.");
      }
    } catch (error) {
      console.error("Error adding field schedule:", error);
    }
    resetForm();
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/edit-field-schedule", {
        fieldScheduleId: availabilityForm.id,
        startDate: dayjs(availabilityForm.startDate).toDate(),
        endDate: dayjs(availabilityForm.endDate).toDate(),
      });

      if (response.status === 200 || response.status === 201) {
        setIsEditModalOpen(false);
        fetchSchedules(
          fields.find((field) => field.fieldId === selectedFieldId)
        );
      } else {
        console.error("Failed to edit schedule on the server.");
      }
    } catch (error) {
      console.error("Error editing field schedule:", error);
    }
    resetForm();
  };

  const resetForm = () => {
    setAvailabilityForm({
      subfieldId: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.post("/api/delete-field-schedule", {
        fieldScheduleId: availabilityForm.id,
      });

      if (response.status === 200 || response.status === 201) {
        setIsEditModalOpen(false);
        fetchSchedules(
          fields.find((field) => field.fieldId === selectedFieldId)
        );
      } else {
        console.error("Failed to remove event on the server.");
      }
    } catch (error) {
      console.error("Error removing field schedule:", error);
    }
    resetForm();
  };

  const getGameDetails = async (gameId) => {
    try {
      const response = await axios.get(
        `/api/owner-get-game-data?gameId=${gameId}`
      );
      if (response.status === 200 || response.status === 201) {
        setIsGameModalOpen(true);
        setGameDetails(response.data);
      } else {
        console.error("Failed to get game details from the server.");
      }
    } catch (error) {
      console.error("Error getting game details:", error);
    }
  };

  const handleEventClick = (item) => {
    if (item.type === "schedule") {
      setAvailabilityForm({
        subfieldId: selectedSubfieldId,
        id: item.id,
        startDate: dayjs(item.startDate).format("YYYY-MM-DDTHH:mm"),
        endDate: dayjs(item.endDate).format("YYYY-MM-DDTHH:mm"),
      });
      setIsEditModalOpen(true);
    } else if (item.type === "game") {
      getGameDetails(item.id);
    }
  };

  // const filteredSchedulerData = schedulerData
  //   .filter((field) => field.fieldId === selectedFieldId)
  //   .flatMap((field) => field.subfields)
  //   .map((subfield) => ({
  //     ...subfield,
  //     data: subfield.data.filter(
  //       (event) =>
  //         dayjs(event.startDate).isBetween(range.startDate, range.endDate) ||
  //         dayjs(event.endDate).isBetween(range.startDate, range.endDate) ||
  //         (dayjs(event.startDate).isBefore(range.startDate) &&
  //           dayjs(event.endDate).isAfter(range.endDate))
  //     ),
  //   }));

  const handleRangeChange = useCallback((newRange) => {
    setRange(newRange);
  }, []);

  return (
    <div className="flex flex-col gap-8 bg-gray-100 p-8 min-h-screen">
      {fields.length === 0 ? (
        <div className="text-center">No Fields Available</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">
            Field Selection
          </h2>
          <div className="flex gap-4 items-end mb-8">
            <form className="md:w-1/4 sm:w-1/2">
              <label
                htmlFor="field_select"
                className="block mb-2 w-full text-sm font-medium text-gray-900"
              >
                Field
              </label>
              <select
                id="field_select"
                value={selectedFieldId}
                onChange={handleFieldChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {fields.map((field) => (
                  <option key={field.fieldId} value={field.fieldId}>
                    {field.label.title}
                  </option>
                ))}
              </select>
            </form>

            {fields.find((field) => field.fieldId === selectedFieldId)
              ?.subfields?.length === 0 ? (
              <div className="text-base font-medium text-center text-gray-500">
                No Subfields Available
              </div>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300"
              >
                Add Availability
              </button>
            )}
          </div>

          <div>
            <StyledSchedulerFrame>
              <Scheduler
                data={filteredSchedulerData}
                isLoading={false}
                onRangeChange={handleRangeChange}
                onTileClick={handleEventClick}
                config={{
                  zoom: 2,
                  maxRecordsPerPage: 10,
                  showTooltip: false,
                  filterButtonState: -1,
                }}
              />
            </StyledSchedulerFrame>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Add Availability
            </h2>
            <form onSubmit={handleAddFormSubmit}>
              <label
                for="subfield_select"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Subfield
              </label>
              <select
                id="subfield_select"
                value={selectedSubfieldId}
                onChange={(e) => setSelectedSubfieldId(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {fields
                  .find((field) => field.fieldId === selectedFieldId)
                  ?.subfields.map((subfield) => (
                    <option key={subfield.id} value={subfield.id}>
                      {subfield.label.title}
                    </option>
                  ))}
              </select>
              <label
                for="start_date_input"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Start Date
              </label>
              <input
                id="start_date_input"
                type="datetime-local"
                value={availabilityForm.startDate}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    startDate: e.target.value,
                  })
                }
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label
                for="end_date_input"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                End Date
              </label>
              <input
                id="end_date_input"
                type="datetime-local"
                value={availabilityForm.endDate}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    endDate: e.target.value,
                  })
                }
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white p-3 rounded-md hover:bg-green-800 transition-all duration-300"
              >
                Add Availability
              </button>
            </form>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="mt-4 w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Edit Availability
            </h2>
            <form onSubmit={handleEditFormSubmit}>
              <p className="text-center font-semibold mb-4 p-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                Subfield{" "}
                {fields
                  .find((field) => field.fieldId === selectedFieldId)
                  ?.subfields.find(
                    (subfield) => subfield.id === selectedSubfieldId
                  )?.label?.title || ""}
              </p>
              <label
                for="start_date_input"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Start Date
              </label>
              <input
                id="start_date_input"
                type="datetime-local"
                value={availabilityForm.startDate}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    startDate: e.target.value,
                  })
                }
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label
                for="end_date_input"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                End Date
              </label>
              <input
                id="end_date_input"
                type="datetime-local"
                value={availabilityForm.endDate}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    endDate: e.target.value,
                  })
                }
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white p-3 rounded-md hover:bg-green-800 transition-all duration-300"
              >
                Edit Availability
              </button>
              <button
                type="button"
                onClick={handleDeleteEvent}
                className="w-full bg-red-700 text-white p-3 rounded-md hover:bg-red-800 transition-all duration-300 mt-3"
              >
                Delete Availability
              </button>
            </form>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="mt-4 w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isGameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {gameDetails.name || "Game Details"}
            </h2>
            <ul className="text-gray-700 space-y-2">
              <li>
                <strong>Location:</strong>{" "}
                {gameDetails.location || "Not provided"}
              </li>
              <li>
                <strong>Price:</strong>{" "}
                {gameDetails.price !== null ? `$${gameDetails.price}` : "Free"}
              </li>
              <li>
                <strong>Max Players:</strong>{" "}
                {gameDetails.maxPlayers !== null
                  ? gameDetails.maxPlayers
                  : "Unlimited"}
              </li>
              <li>
                <strong>Player Count:</strong> {gameDetails.playerCount || 0}
              </li>
              <li>
                <strong>Organizer Email:</strong>{" "}
                {gameDetails.organizerEmail || "Not provided"}
              </li>
              <li>
                <strong>Organizer Picture:</strong>{" "}
                {gameDetails.organizerProfilePicture ? (
                  <img
                    src={gameDetails.organizerProfilePicture}
                    alt="Organizer"
                    className="w-52 h-52 rounded-full mt-2"
                  />
                ) : (
                  "Not provided"
                )}
              </li>
            </ul>
            <button
              onClick={() => setIsGameModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignAvailabilities;
