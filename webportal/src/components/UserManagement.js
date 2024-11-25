import { useEffect, useState } from "react";
import LazyLoadingTable from "./Table";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editRow, setEditRow] = useState(NaN);
  const [editedRole, setEditedRole] = useState("");
  const [roles, setRoles] = useState(["field owner", "admin", "player"]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/get-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const columns = [
    "User ID",
    "Username",
    "Email",
    // "First Name",
    // "Last Name",
    "Profile Picture",
    "Role",
    "Actions",
  ];

  const handleUpdateUser = async (userId, newRole) => {
    try {
      const response = await axios.post("/api/admin-edit-user", {
        userId,
        role: newRole,
      });
      await fetchUsers();
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.post("/api/admin-delete-user", {
        userId,
      });
      await fetchUsers();
    } catch (error) {
      console.error(
        "Error delete user:",
        error.response?.data || error.message
      );
    }
  };

  const data = users.map((user, i) => {
    const isEditing = editRow === i;

    const handleEditClick = () => {
      if (!isEditing) {
        setEditRow(i);
        setEditedRole(user.role);
      } else {
        handleUpdateUser(user.userId, editedRole);
        setEditRow(NaN);
      }
    };
    const handleCancelClick = () => {
      setEditRow(NaN);
    };

    return [
      user.userId || "N/A",
      user.username || "N/A",
      user.email || "N/A",
      // user.firstName || "N/A",
      // user.lastName || "N/A",
      user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-12 h-12 object-cover rounded-full border border-gray-300"
        />
      ) : (
        <div className="text-gray-500 italic">No Image</div>
      ),
      isEditing ? (
        <select
          className="border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editedRole}
          onChange={(e) => setEditedRole(e.target.value)}
        >
          {roles.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>
      ) : (
        user.role
      ),
      isEditing ? (
        <div className="flex justify-around">
          <button
            onClick={handleEditClick}
            className="bg-green-500 text-white p-2 rounded text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5v-13Z" />
              <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V16Zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V0ZM9 1h2v4H9V1Z" />
            </svg>
            Save
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-yellow-500 text-white p-2 rounded text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-around">
          <button
            onClick={handleEditClick}
            className="bg-green-500 text-white p-2 rounded text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user.user_id)}
            className="bg-red-500 text-white p-2 rounded text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mr-1"
              viewBox="0 0 16 16"
            >
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
            </svg>
            Delete
          </button>
        </div>
      ),
    ];
  });

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        User Management
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <LazyLoadingTable
          columns={columns}
          data={data}
          rowLoad={[10, 20, 50]}
          className="w-full table-auto text-sm border-collapse"
        />
      </div>
    </div>
  );
};

export default UserManagement;
