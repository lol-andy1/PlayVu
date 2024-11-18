import React from "react";

const FieldTable = ({ fields, onEditField, onDeleteField }) => {
  return (
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
              <td className="px-6 py-4">{field.streetAddress}</td>
              <td className="px-6 py-4">{field.zipCode}</td>
              <td className="px-6 py-4">{field.city}</td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEditField(field)}
                  className="font-medium text-green-600 mr-4 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteField(field)}
                  className="font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FieldTable;
