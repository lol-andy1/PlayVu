import { useState } from "react";
import samplefield from "../assets/samplefield.jpg";

const AddField = ({ onSendField, lastId }) => {
  const clearData = {
    name: "",
    streetAddress: "",
    zipCode: "",
    city: "",
    price: NaN,
    description: "",
    picture: "",
  };

  const [toggleForm, setToggleForm] = useState(false);
  const [formData, setFormData] = useState(clearData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Field name is required.";
    if (!formData.streetAddress)
      newErrors.streetAddress = "Street address is required.";
    if (!/^\d{5}$/.test(formData.zipCode))
      newErrors.zipCode = "Zip Code must be 5 digits.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      const fieldInfo = {
        id: lastId + 1,
        name: formData.name,
        streetAddress: formData.streetAddress,
        zipCode: formData.zipCode,
        city: formData.city,
        price: formData.price,
        description: formData.description,
        picture: formData.picture,
      };
      onSendField(fieldInfo);
      setFormData(clearData);
      setToggleForm(false);
      setErrors({});
    }
  };

  return (
    <div>
      <button
        onClick={() => setToggleForm(!toggleForm)}
        className={`bg-green-600 text-white px-4 py-2 w-full text-left flex items-center justify-between ${
          toggleForm ? "rounded-t-md" : "rounded-md"
        } focus:outline-none hover:bg-green-700 transition`}
      >
        <div className="font-semibold">Add Field</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 ml-2 transition-transform duration-200 transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {toggleForm && (
        <div className="border-2 border-green-600 rounded-b-md p-4 bg-gray-50">
          {/* Field Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Field Name
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              type="text"
              name="name"
              id="name"
              value={formData.name}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Street Address */}
          <div className="mb-4">
            <label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, streetAddress: e.target.value })
              }
              type="text"
              name="streetAddress"
              id="streetAddress"
              value={formData.streetAddress}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
            />
            {errors.streetAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.streetAddress}
              </p>
            )}
          </div>

          {/* Zip Code */}
          <div className="mb-4">
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700"
            >
              Zip Code
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              type="text"
              name="zipCode"
              id="zipCode"
              value={formData.zipCode}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
              maxLength={5}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
            )}
          </div>

          {/* City */}
          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              type="text"
              name="city"
              id="city"
              value={formData.city}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              type="number"
              name="price"
              id="price"
              value={formData.price}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          {/* picture */}
          <div className="mb-4">
            <label
              htmlFor="picture"
              className="block text-sm font-medium text-gray-700"
            >
              Picture
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, picture: e.target.value })
              }
              type="text"
              name="picture"
              id="picture"
              value={formData.picture}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
            />
            {formData.picture ? (
              <img
                src={formData.picture}
                className="w-full h-60 object-cover rounded-b-lg mt-3"
              />
            ) : (
              <img
                src={samplefield}
                className="w-full h-60 object-cover rounded-lg mt-3"
              />
            )}

            {errors.picture && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              className="w-full p-2 mt-1 border rounded focus:ring-green-500 focus:border-green-500"
              placeholder="Enter a description"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleFormSubmit}
              className="bg-green-600 text-white py-2 px-4 rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddField;
