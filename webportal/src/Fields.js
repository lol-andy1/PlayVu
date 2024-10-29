import React, { useState } from "react";
import AddField from "./components/AddField";
import FieldTable from "./components/FieldTable";
import FieldModal from "./components/FieldModal";
import axios from "axios";

const Fields = () => {
  const [fields, setFields] = useState([
    {
      id: 1,
      name: "Greenfield Stadium",
      streetAddress: "123 Green St",
      zipCode: "12345",
      city: "Springfield",
      description: "A popular soccer field with great facilities",
      subfields: [],
    },
    {
      id: 2,
      name: "Riverside Park",
      streetAddress: "456 River Rd",
      zipCode: "54321",
      city: "Rivertown",
      description: "Located by the river, scenic and spacious",
      subfields: [],
    },
    {
      id: 3,
      name: "Downtown Arena",
      streetAddress: "789 Center Ave",
      zipCode: "67890",
      city: "Metro City",
      description: "Centrally located, often used for tournaments",
      subfields: [],
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [subfieldName, setSubfieldName] = useState("");

  const editField = (field) => {
    const fieldWithSubfields = {
      ...field,
      subfields: field.subfields || [],
    };
    setSelectedField(fieldWithSubfields);
    setIsModalOpen(true);
  };

  const addSubfield = async () => {
    if (!selectedField) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/add-subfield",
        {
          master_field_id: selectedField.id,
          name: subfieldName || "New Subfield",
        }
      );

      if (response.status === 201) {
        const newSubfield = {
          id: response.data.id,
          name: subfieldName || "New Subfield",
        };
        const updatedField = {
          ...selectedField,
          subfields: [...selectedField.subfields, newSubfield],
        };
        setSelectedField(updatedField);
        setSubfieldName("");
      }
    } catch (error) {
      console.error("Error adding subfield:", error);
    }
  };

  const saveField = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/edit-field",
        {
          field_id: selectedField.id,
          name: selectedField.name,
          city: selectedField.city,
        }
      );

      if (response.status === 200) {
        const updatedFields = fields.map((field) =>
          field.id === selectedField.id ? selectedField : field
        );
        setFields(updatedFields);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving field:", error);
    }
  };

  const addFieldToApi = async (field) => {
    try {
      const response = await axios.post("http://localhost:8080/api/add-field", {
        name: field.name,
        description: field.description || "No description",
        address: field.streetAddress,
        zip_code: field.zipCode,
        city: field.city,
      });
      if (response.status === 201) {
        setFields([...fields, response.data]);
      }
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Fields Page</h1>

      <AddField
        onSendField={addFieldToApi}
        lastId={fields.reduce(
          (prev, curr) => (curr.id > prev ? curr.id : prev),
          0
        )}
      />

      <FieldTable fields={fields} onEditField={editField} />

      <FieldModal
        isOpen={isModalOpen}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        subfieldName={subfieldName}
        setSubfieldName={setSubfieldName}
        handleSubfieldNameChange={(subfieldId, value) => {
          const updatedSubfields = selectedField.subfields.map((subfield) =>
            subfield.id === subfieldId ? { ...subfield, name: value } : subfield
          );
          setSelectedField({ ...selectedField, subfields: updatedSubfields });
        }}
        addSubfield={addSubfield}
        removeSubfield={(subfieldId) => {
          const updatedSubfields = selectedField.subfields.filter(
            (subfield) => subfield.id !== subfieldId
          );
          setSelectedField({ ...selectedField, subfields: updatedSubfields });
        }}
        closeModal={() => setIsModalOpen(false)}
        saveField={saveField}
      />
    </div>
  );
};

export default Fields;
