import { useEffect, useState } from "react";
import LazyLoadingTable from "./Table";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/get-users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    "User ID",
    "Username",
    "Email",
    "First Name",
    "Last Name",
    "Profile Picture",
  ];

  const data = users.map((user) => [
    user.userId || "N/A",
    user.username || "N/A",
    user.email || "N/A",
    user.firstName || "N/A",
    user.lastName || "N/A",
    user.profilePicture ? (
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-12 h-12 object-cover rounded-full border border-gray-300"
      />
    ) : (
      <div className="text-gray-500 italic">No Image</div>
    ),
  ]);

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
