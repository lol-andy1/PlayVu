import React from "react";

const FieldModal = ({
  isOpen,
  selectedField,
  setSelectedField,
  subfieldName,
  setSubfieldName,
  handleSubfieldNameChange,
  addSubfield,
  removeSubfield,
  closeModal,
  saveField,
}) => {
  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setSelectedField((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      id="select-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
    >
      <div className="relative p-4 w-full max-w-3xl max-h-full">
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
                  value={selectedField?.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="block w-full p-2 border border-gray-200 rounded-lg"
                />
              </li>
              <li>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={selectedField?.streetAddress || ""}
                  onChange={(e) =>
                    handleFieldChange("streetAddress", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-200 rounded-lg"
                />
              </li>
              <li>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={selectedField?.zipCode || ""}
                  onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                  className="block w-full p-2 border border-gray-200 rounded-lg"
                />
              </li>
              <li>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={selectedField?.city || ""}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  className="block w-full p-2 border border-gray-200 rounded-lg"
                />
              </li>
              <li>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={selectedField?.price || ""}
                  onChange={(e) => handleFieldChange("price", e.target.value)}
                  className="block w-full p-2 border border-gray-200 rounded-lg"
                />
              </li>
              <li>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedField?.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
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
                          handleSubfieldNameChange(subfield.id, e.target.value)
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
                className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 p-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <button
            onClick={closeModal}
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
  );
};

export default FieldModal;
