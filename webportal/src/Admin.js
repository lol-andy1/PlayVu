import { useState } from "react";
import UserManagement from "./components/UserManagement";
import FormResponses from "./components/ownerRequests";

const Admin = () => {
  const navItems = [{ name: "Users" }, { name: "Field Owners Applications" }];

  const [selectedNavItem, setSelectedNavItem] = useState(navItems[0].name);

  const renderContent = () => {
    switch (selectedNavItem) {
      case "Users":
        return <UserManagement />;
      case "Field Owners Applications":
        return <FormResponses />;
      default:
        return <UserManagement />;
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

export default Admin;
