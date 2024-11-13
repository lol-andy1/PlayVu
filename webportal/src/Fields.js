import React, { useState, useEffect } from "react";
import AddField from "./components/AddField";
import FieldTable from "./components/FieldTable";
import FieldModal from "./components/FieldModal";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Fields = () => {
  const { isAuthenticated } = useAuth0();
  const [fields, setFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [subfieldName, setSubfieldName] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchFields();
    }
  }, [isAuthenticated]);

  const fetchFields = async () => {
    try {
      const response = await axios.get("/api/get-owner-fields");
      const fieldsData = response.data.map((field) => ({
        id: field.fieldId,
        name: field.fieldName,
        streetAddress: field.address,
        zipCode: field.zipCode,
        city: field.city,
        description: field.description || "No description provided",
        subfields: field.subFields.map((subField) => ({
          id: subField.subFieldId,
          name: subField.name,
          data: subField.data || [],
        })),
      }));
      setFields(fieldsData);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

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
      const response = await axios.post("/api/add-subfield", {
        masterFieldId: selectedField.id,
        name: subfieldName || "New Subfield",
      });

      if (response.status === 200) {
        const newSubfield = {
          id: response.data,
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

  const handleRemoveSubfield = async (subfieldId) => {
    try {
      const response = await axios.post("/api/delete-subfield", {
        subFieldId: subfieldId,
      });

      if (response.status === 200) {
        const updatedSubfields = selectedField.subfields.filter(
          (subfield) => subfield.id !== subfieldId
        );
        setSelectedField({ ...selectedField, subfields: updatedSubfields });
      } else {
        console.error("Failed to delete subfield from server");
      }
    } catch (error) {
      console.error("Error deleting subfield:", error);
    }
  };

  const saveField = async () => {
    try {
      const response = await axios.post("/api/edit-field", {
        fieldId: selectedField.id,
        name: selectedField.name,
        address: selectedField.streetAddress,
        zipCode: selectedField.zipCode,
        description: selectedField.description,
        city: selectedField.city,
      });

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
    fetchFields();
  };

  const addFieldToApi = async (field) => {
    try {
      const response = await axios.post("/api/add-field", {
        name: field.name,
        description: field.description || "No description",
        address: field.streetAddress,
        zipCode: field.zipCode,
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
        removeSubfield={handleRemoveSubfield}
        closeModal={() => {
          setIsModalOpen(false);
          fetchFields();
        }}
        saveField={saveField}
      />
    </div>
  );
};

export default Fields;
