import { useState } from "react";

const AddField = ({ onSendField, lastId }) => {
  const clearData = {
    name: "",
    streetAddress: "",
    zipCode: "",
    city: "",
    description: "",
  };

  let [toggleForm, setToggleForm] = useState(false);
  let [formData, setFormData] = useState(clearData);

  const formDataPosted = () => {
    if (
      formData.name &&
      formData.streetAddress &&
      formData.zipCode &&
      formData.city
    ) {
      const fieldInfo = {
        id: lastId + 1,
        name: formData.name,
        streetAddress: formData.streetAddress,
        zipCode: formData.zipCode,
        city: formData.city,
        description: formData.description,
      };
      onSendField(fieldInfo);
      setFormData(clearData);
      setToggleForm(!toggleForm);
    } else {
      alert("Please fill all required fields");
    }
  };

  return (
    <div>
      <button
        onClick={() => setToggleForm(!toggleForm)}
        className={`bg-green-500 text-white px-2 py-3 w-full text-left  ${
          toggleForm ? "rounded-t-md" : "rounded-md"
        }`}
      >
        <div>Add Field</div>
      </button>
      {toggleForm && (
        <div className="border-r-2 border-b-2 border-l-2 border-light-blue-500 rounded-b-md pl-4 pr-4 pb-4">
          {/* Field Name */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Field Name
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                onChange={(event) => {
                  setFormData({ ...formData, name: event.target.value });
                }}
                type="text"
                name="name"
                id="name"
                value={formData.name}
                required
                className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Street Address
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    streetAddress: event.target.value,
                  });
                }}
                required
                type="text"
                name="streetAddress"
                id="streetAddress"
                value={formData.streetAddress}
                className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Zip Code */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Zip Code
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                required
                onChange={(event) => {
                  setFormData({ ...formData, zipCode: event.target.value });
                }}
                type="text"
                name="zipCode"
                id="zipCode"
                value={formData.zipCode}
                className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* City */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              City
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                onChange={(event) => {
                  setFormData({ ...formData, city: event.target.value });
                }}
                required
                type="text"
                name="city"
                id="city"
                value={formData.city}
                className="max-w-lg block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Description */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Description
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <textarea
                onChange={(event) => {
                  setFormData({ ...formData, description: event.target.value });
                }}
                value={formData.description}
                id="description"
                name="description"
                rows="3"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter a description"
              ></textarea>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={formDataPosted}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddField;
