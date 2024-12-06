import React, { useState, useEffect } from "react";
import AddField from "./components/AddField";
import FieldTable from "./components/FieldTable";
import FieldModal from "./components/FieldModal";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import AssignAvailabilities from "./Schedule";

const Fields = () => {
  const { isAuthenticated } = useAuth0();
  const [fields, setFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        price: field.price,
        picture: field.picture,
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

  const deleteField = (field) => {
    const fieldWithSubfields = {
      ...field,
      subfields: field.subfields || [],
    };
    setSelectedField(fieldWithSubfields);
    setIsDeleteModalOpen(true);
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

      if (response.status === 200 || response.status === 201) {
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
        price: selectedField.price,
        picture: selectedField.picture,
        description: selectedField.description,
        city: selectedField.city,
      });

      if (response.status === 200 || response.status === 201) {
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
        price: field.price,
        picture: field.picture,
      });
      if (response.status === 200 || response.status === 201) {
        fetchFields();
      }
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  const handleDeleteField = async () => {
    try {
      const response = await axios.post("/api/delete-field", {
        fieldId: selectedField.id,
      });
      if (response.status === 200 || response.status === 201) {
        fetchFields();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting field:", error);
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

      <FieldTable
        fields={fields}
        onEditField={editField}
        onDeleteField={deleteField}
      />

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

      {isDeleteModalOpen && (
        <div
          data-testid="delete-modal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Do you really want to delete this field? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                data-testid="delete-modal-btn"
                onClick={handleDeleteField}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FieldOwnerView = () => {
  const navItems = [
    { name: "Field Management" },
    { name: "Schedule Management" },
  ];

  const [selectedNavItem, setSelectedNavItem] = useState(navItems[0].name);

  const renderContent = () => {
    switch (selectedNavItem) {
      case "Field Management":
        return <Fields />;
      case "Schedule Management":
        return <AssignAvailabilities />;
      default:
        return <Fields />;
    }
  };

  return (
    <div>
      <div className="bg-green-600 shadow-lg flex justify-between items-center px-6 py-3">
        <div className="flex gap-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedNavItem(item.name)}
              className={`text-white text-sm font-semibold transition duration-300 ${
                selectedNavItem === item.name
                  ? "underline decoration-2 decoration-white"
                  : "hover:text-gray-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {/* <button className="bg-white text-green-600 text-sm font-medium px-4 py-2 rounded hover:bg-gray-100 transition duration-300">
            right side button
          </button> */}
        </div>
      </div>

      <div className="p-6 bg-gray-100 min-h-screen">{renderContent()}</div>
    </div>
  );
};

export default FieldOwnerView;
