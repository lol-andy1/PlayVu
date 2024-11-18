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
  height: 70vh;
  width: 100%;
`;

export const mockedSchedulerData = [
  {
    fieldId: "1",
    label: {
      title: "Soccer Field 1",
    },
    subfields: [
      {
        id: "1-1",
        label: {
          title: "Subfield A",
        },
        data: [
          {
            id: "1-1-1",
            startDate: new Date("2024-10-26T09:00:00"),
            endDate: new Date("2024-10-26T10:00:00"),
            title: "Youth Training Session",
            description: "Training for the youth soccer team",
            bgColor: "rgb(254,165,177)",
          },
        ],
      },
      {
        id: "1-2",
        label: {
          title: "Subfield B",
        },
        data: [
          {
            id: "1-2-1",
            startDate: new Date("2024-10-26T11:00:00"),
            endDate: new Date("2024-10-26T12:00:00"),
            title: "Adult League Match",
            description: "Adult league match",
            bgColor: "rgb(254,205,165)",
          },
        ],
      },
      {
        id: "1-3",
        label: {
          title: "Subfield C",
        },
        data: [
          {
            id: "1-3-1",
            startDate: new Date("2024-10-26T12:00:00"),
            endDate: new Date("2024-10-26T13:00:00"),
            title: "High School Practice",
            description: "High school soccer practice",
            bgColor: "rgb(165,105,254)",
          },
        ],
      },
      {
        id: "1-4",
        label: {
          title: "Subfield D",
        },
        data: [
          {
            id: "1-4-1",
            startDate: new Date("2024-10-26T13:00:00"),
            endDate: new Date("2024-10-26T14:00:00"),
            title: "Local Tournament",
            description: "Local soccer tournament round 1",
            bgColor: "rgb(105,205,165)",
          },
        ],
      },
      {
        id: "1-5",
        label: {
          title: "Subfield E",
        },
        data: [
          {
            id: "1-5-1",
            startDate: new Date("2024-10-26T14:00:00"),
            endDate: new Date("2024-10-26T15:00:00"),
            title: "Kids Soccer Clinic",
            description: "Beginner soccer clinic for kids",
            bgColor: "rgb(105,165,205)",
          },
        ],
      },
      {
        id: "1-6",
        label: {
          title: "Subfield F",
        },
        data: [
          {
            id: "1-6-1",
            startDate: new Date("2024-10-26T15:00:00"),
            endDate: new Date("2024-10-26T16:00:00"),
            title: "Referee Training",
            description: "Training session for referees",
            bgColor: "rgb(205,105,254)",
          },
        ],
      },
      {
        id: "1-7",
        label: {
          title: "Subfield G",
        },
        data: [
          {
            id: "1-7-1",
            startDate: new Date("2024-10-26T16:00:00"),
            endDate: new Date("2024-10-26T17:00:00"),
            title: "Women's League Game",
            description: "Women's soccer league game",
            bgColor: "rgb(165,254,205)",
          },
        ],
      },
      {
        id: "1-8",
        label: {
          title: "Subfield H",
        },
        data: [
          {
            id: "1-8-1",
            startDate: new Date("2024-10-26T17:00:00"),
            endDate: new Date("2024-10-26T18:00:00"),
            title: "U18 Championship",
            description: "U18 soccer championship game",
            bgColor: "rgb(254,165,105)",
          },
        ],
      },
      {
        id: "1-9",
        label: {
          title: "Subfield I",
        },
        data: [
          {
            id: "1-9-1",
            startDate: new Date("2024-10-26T18:00:00"),
            endDate: new Date("2024-10-26T19:00:00"),
            title: "Youth Friendly Match",
            description: "Youth friendly soccer match",
            bgColor: "rgb(254,205,105)",
          },
        ],
      },
      {
        id: "1-10",
        label: {
          title: "Subfield J",
        },
        data: [
          {
            id: "1-10-1",
            startDate: new Date("2024-10-26T19:00:00"),
            endDate: new Date("2024-10-26T20:00:00"),
            title: "High School Game",
            description: "High school soccer game",
            bgColor: "rgb(205,254,105)",
          },
        ],
      },
    ],
  },
  {
    fieldId: "2",
    label: {
      title: "Soccer Field 2",
    },
    subfields: [
      {
        id: "2-1",
        label: {
          title: "Subfield K",
        },
        data: [
          {
            id: "2-1-1",
            startDate: new Date("2024-10-27T09:00:00"),
            endDate: new Date("2024-10-27T10:00:00"),
            title: "Youth League Match",
            description: "Youth soccer league match",
            bgColor: "rgb(165,254,177)",
          },
        ],
      },
      {
        id: "2-2",
        label: {
          title: "Subfield L",
        },
        data: [
          {
            id: "2-2-1",
            startDate: new Date("2024-10-27T11:00:00"),
            endDate: new Date("2024-10-27T12:00:00"),
            title: "Advanced Training Session",
            description: "Training session for advanced players",
            bgColor: "rgb(165,205,254)",
          },
        ],
      },
      {
        id: "2-3",
        label: {
          title: "Subfield M",
        },
        data: [
          {
            id: "2-3-1",
            startDate: new Date("2024-10-27T12:00:00"),
            endDate: new Date("2024-10-27T13:00:00"),
            title: "Youth Scrimmage",
            description: "Youth soccer scrimmage match",
            bgColor: "rgb(205,165,254)",
          },
        ],
      },
      {
        id: "2-4",
        label: {
          title: "Subfield N",
        },
        data: [
          {
            id: "2-4-1",
            startDate: new Date("2024-10-27T13:00:00"),
            endDate: new Date("2024-10-27T14:00:00"),
            title: "Women's Friendly",
            description: "Women's friendly soccer match",
            bgColor: "rgb(165,254,105)",
          },
        ],
      },
      {
        id: "2-5",
        label: {
          title: "Subfield O",
        },
        data: [
          {
            id: "2-5-1",
            startDate: new Date("2024-10-27T14:00:00"),
            endDate: new Date("2024-10-27T15:00:00"),
            title: "College Practice",
            description: "College soccer practice",
            bgColor: "rgb(254,105,205)",
          },
        ],
      },
      {
        id: "2-6",
        label: {
          title: "Subfield P",
        },
        data: [
          {
            id: "2-6-1",
            startDate: new Date("2024-10-27T15:00:00"),
            endDate: new Date("2024-10-27T16:00:00"),
            title: "Referee Practice",
            description: "Practice session for referees",
            bgColor: "rgb(105,254,165)",
          },
        ],
      },
      {
        id: "2-7",
        label: {
          title: "Subfield Q",
        },
        data: [
          {
            id: "2-7-1",
            startDate: new Date("2024-10-27T16:00:00"),
            endDate: new Date("2024-10-27T17:00:00"),
            title: "Professional Practice",
            description: "Professional soccer team practice",
            bgColor: "rgb(205,105,105)",
          },
        ],
      },
      {
        id: "2-8",
        label: {
          title: "Subfield R",
        },
        data: [
          {
            id: "2-8-1",
            startDate: new Date("2024-10-27T17:00:00"),
            endDate: new Date("2024-10-27T18:00:00"),
            title: "Community Soccer",
            description: "Community soccer meetup",
            bgColor: "rgb(254,105,105)",
          },
        ],
      },
      {
        id: "2-9",
        label: {
          title: "Subfield S",
        },
        data: [
          {
            id: "2-9-1",
            startDate: new Date("2024-10-27T18:00:00"),
            endDate: new Date("2024-10-27T19:00:00"),
            title: "Local League Match",
            description: "Local soccer league match",
            bgColor: "rgb(105,105,205)",
          },
        ],
      },
      {
        id: "2-10",
        label: {
          title: "Subfield T",
        },
        data: [
          {
            id: "2-10-1",
            startDate: new Date("2024-10-27T19:00:00"),
            endDate: new Date("2024-10-27T20:00:00"),
            title: "Semi-Pro Match",
            description: "Semi-professional soccer match",
            bgColor: "rgb(105,205,105)",
          },
        ],
      },
    ],
  },
];

const AssignAvailabilities = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [selectedSubfieldId, setSelectedSubfieldId] = useState("");
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [availabilityForm, setAvailabilityForm] = useState({
    mode: "Add",
    subfieldId: "",
    startDate: "",
    endDate: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [schedulerData, setSchedulerData] = useState([]);

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
          setSelectedFieldId(transformedFields[0].fieldId);
          setSelectedSubfieldId(transformedFields[0].subfields[0]?.id || "");
          fetchSchedules(transformedFields[0].fieldId);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    fetchFields();
  }, []);

  const fetchSchedules = async (fieldId) => {
    try {
      const response = await axios.get(
        `/api/get-field-schedules?fieldId=${fieldId}`
      );
      const updatedFields = fields.map((field) =>
        field.fieldId === fieldId
          ? {
              ...field,
              subfields: field.subfields.map((subfield) => {
                const scheduleData = response.data.find(
                  (schedule) => schedule.subFieldId.toString() === subfield.id
                );
                return {
                  ...subfield,
                  data: scheduleData
                    ? scheduleData.data.map((event) => ({
                        id: dayjs().toString(),
                        startDate: dayjs(event.startDate).toDate(),
                        endDate: dayjs(event.endDate).toDate(),
                        title: "Scheduled Event",
                        description: `Scheduled Event from ${event.startDate} to ${event.endDate}`,
                        bgColor: "rgb(200,200,200)",
                      }))
                    : [],
                };
              }),
            }
          : field
      );

      setSchedulerData(updatedFields);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleFieldChange = (e) => {
    const fieldId = e.target.value;
    setSelectedFieldId(fieldId);
    const selectedField = fields.find((field) => field.fieldId === fieldId);
    setSelectedSubfieldId(selectedField?.subfields[0]?.id || "");
    fetchSchedules(fieldId);
  };

  const handleRangeChange = useCallback((newRange) => {
    setRange(newRange);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = {
      id: selectedEvent?.id || dayjs().toString(),
      startDate: dayjs(availabilityForm.startDate).toDate(),
      endDate: dayjs(availabilityForm.endDate).toDate(),
      title:
        availabilityForm.mode === "Add"
          ? "New Availability"
          : "Updated Availability",
      description:
        availabilityForm.mode === "Add"
          ? "Added Availability"
          : "Edited Availability",
      bgColor: "rgb(200,200,200)",
    };

    if (availabilityForm.mode === "Add") {
      try {
        const response = await axios.post("/api/add-field-schedule", {
          subFieldId: selectedSubfieldId,
          startDate: availabilityForm.startDate,
          endDate: availabilityForm.endDate,
        });

        if (response.status === 200 || response.status === 201) {
          const updatedData = schedulerData.map((field) =>
            field.fieldId === selectedFieldId
              ? {
                  ...field,
                  subfields: field.subfields.map((subfield) =>
                    subfield.id === selectedSubfieldId
                      ? { ...subfield, data: [...subfield.data, updatedEvent] }
                      : subfield
                  ),
                }
              : field
          );

          setSchedulerData(updatedData);
          resetForm();
        } else {
          console.error("Failed to add schedule on the server.");
        }
      } catch (error) {
        console.error("Error adding field schedule:", error);
      }
    } else if (availabilityForm.mode === "Edit" && selectedEvent) {
      try {
        const response = await axios.post("/api/edit-field-schedule", {
          fieldScheduleId: selectedEvent.id,
          startDate: availabilityForm.startDate,
          endDate: availabilityForm.endDate,
        });

        if (response.status === 200 || response.status === 201) {
          const updatedData = schedulerData.map((field) =>
            field.fieldId === selectedFieldId
              ? {
                  ...field,
                  subfields: field.subfields.map((subfield) =>
                    subfield.id === selectedSubfieldId
                      ? {
                          ...subfield,
                          data: subfield.data.map((event) =>
                            event.id === selectedEvent.id ? updatedEvent : event
                          ),
                        }
                      : subfield
                  ),
                }
              : field
          );

          setSchedulerData(updatedData);
          resetForm();
        } else {
          console.error("Failed to edit schedule on the server.");
        }
      } catch (error) {
        console.error("Error editing field schedule:", error);
      }
    }
  };

  const resetForm = () => {
    setAvailabilityForm({
      mode: "Add",
      subfieldId: "",
      startDate: "",
      endDate: "",
    });
    setSelectedEvent(null);
  };

  const handleItemClick = (item) => {
    setSelectedEvent(item);
    setAvailabilityForm({
      mode: "Edit",
      subfieldId: selectedSubfieldId,
      startDate: item.startDate.toISOString().slice(0, 16),
      endDate: item.endDate.toISOString().slice(0, 16),
    });
  };

  const filteredSchedulerData = schedulerData
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

  return (
    <div className="flex flex-col gap-8 bg-gray-100 p-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fields?.length === 0 || !fields ? (
          <>No Fields</>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Field Selection
            </h2>
            <select
              value={selectedFieldId}
              onChange={handleFieldChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fields.map((field) => (
                <option key={field.fieldId} value={field.fieldId}>
                  {field.label.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {fields.filter((field) => field.fieldId === Number(selectedFieldId))[0]
          ?.subfields?.length === 0 ? (
          <>No subfields</>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              {availabilityForm.mode} Availability
            </h2>
            <form onSubmit={handleFormSubmit}>
              <select
                value={selectedSubfieldId}
                onChange={(e) => setSelectedSubfieldId(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fields
                  .find((field) => field.fieldId === selectedFieldId)
                  ?.subfields.map((subfield) => (
                    <option key={subfield.id} value={subfield.id}>
                      {subfield.label.title}
                    </option>
                  ))}
              </select>
              <input
                type="datetime-local"
                value={availabilityForm.startDate}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    startDate: e.target.value,
                  })
                }
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                value={availabilityForm.endDate}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    endDate: e.target.value,
                  })
                }
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white p-3 rounded-md hover:bg-green-800 transition-all duration-300"
              >
                {availabilityForm.mode} Availability
              </button>
            </form>
          </div>
        )}
      </div>

      {fields.filter((field) => field.fieldId === Number(selectedFieldId))[0]
        ?.subfields?.length === 0 ? (
        <>No subfields</>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <StyledSchedulerFrame>
            <Scheduler
              data={filteredSchedulerData}
              isLoading={false}
              onRangeChange={handleRangeChange}
              onTileClick={handleItemClick}
              config={{
                zoom: 2,
                maxRecordsPerPage: 10,
                showTooltip: false,
                isFiltersButtonVisible: false,
              }}
            />
          </StyledSchedulerFrame>
        </div>
      )}
    </div>
  );
};

export default AssignAvailabilities;
