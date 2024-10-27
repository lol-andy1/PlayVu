import React, { useState } from "react";
import AddField from "./components/AddField";

const Fields = () => {
  const [fields, setFields] = useState([]);
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

  const addSubfield = () => {
    if (!selectedField) return;
    const newSubfield = {
      id: Date.now(),
      name: subfieldName || "New Subfield",
    };
    const updatedField = {
      ...selectedField,
      subfields: [...selectedField.subfields, newSubfield],
    };
    setSelectedField(updatedField);
    setSubfieldName("");
  };

  const removeSubfield = (subfieldId) => {
    const updatedSubfields = selectedField.subfields.filter(
      (subfield) => subfield.id !== subfieldId
    );
    setSelectedField({ ...selectedField, subfields: updatedSubfields });
  };

  const handleSubfieldNameChange = (subfieldId, value) => {
    const updatedSubfields = selectedField.subfields.map((subfield) =>
      subfield.id === subfieldId ? { ...subfield, name: value } : subfield
    );
    setSelectedField({ ...selectedField, subfields: updatedSubfields });
  };

  const saveField = () => {
    const updatedFields = fields.map((field) =>
      field.id === selectedField.id ? selectedField : field
    );
    setFields(updatedFields);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Fields Page</h1>

      {/* Add new field using the AddField component */}
      <AddField
        onSendField={(field) => {
          setFields([...fields, field]);
        }}
        lastId={fields.reduce(
          (prev, curr) => (curr.id > prev ? curr.id : prev),
          0
        )}
      />

      {/* Display fields in a table */}
      {fields.length > 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-green-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Field Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Street Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Zip Code
                </th>
                <th scope="col" className="px-6 py-3">
                  City
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {field.name}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {field.streetAddress}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {field.zipCode}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {field.city}
                  </th>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => editField(field)}
                      className="font-medium text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          id="select-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
        >
          <div className="relative p-4 w-full max-w-3xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow flex">
              {/* Column 1: Field Info */}
              <div className="w-1/2 p-4 md:p-5 border-r">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Edit Field Info
                </h3>
                <ul className="space-y-4">
                  <li>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedField?.name}
                      className="block w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </li>
                  <li>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedField?.streetAddress}
                      className="block w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </li>
                  <li>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedField?.zipCode}
                      className="block w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </li>
                  <li>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedField?.city}
                      className="block w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </li>
                </ul>
              </div>

              {/* Column 2: Subfields */}
              <div className="w-1/2 p-4 md:p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Subfields
                </h3>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-2">
                        Subfield Name
                      </th>
                      <th scope="col" className="px-6 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedField?.subfields || []).map((subfield) => (
                      <tr key={subfield.id} className="bg-white border-b">
                        <td className="px-6 py-2">
                          <input
                            type="text"
                            value={subfield.name}
                            onChange={(e) =>
                              handleSubfieldNameChange(
                                subfield.id,
                                e.target.value
                              )
                            }
                            className="block w-full p-2 border border-gray-200 rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-2">
                          <button
                            onClick={() => removeSubfield(subfield.id)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add new subfield */}
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="New Subfield Name"
                    value={subfieldName}
                    onChange={(e) => setSubfieldName(e.target.value)}
                    className="block w-full p-2 border border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={addSubfield}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
                  >
                    Add Subfield
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={saveField}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;
