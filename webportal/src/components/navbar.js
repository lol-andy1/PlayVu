import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const location = useLocation();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="bg-white border-gray-200 dark:bg-green-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            PlayVu Portal
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="rounded-full w-10 h-10"
                />
                <span className="text-gray-900 dark:text-white">
                  Welcome, {user.name}
                </span>
              </div>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={loginWithRedirect}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Log In
            </button>
          )}

          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
            onClick={handleNavCollapse}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isNavCollapsed ? "hidden" : ""
          } items-center justify-between w-full md:flex md:w-auto`}
          id="navbar-cta"
        >
          <ul className="flex flex-col md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded-md text-gray-700 dark:text-white ${
                  location.pathname === "/"
                    ? "bg-green-100 dark:bg-green-800"
                    : ""
                }`}
              >
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/schedule"
                  className={`block py-2 px-3 rounded-md text-gray-700 dark:text-white ${
                    location.pathname === "/schedule"
                      ? "bg-green-100 dark:bg-green-800"
                      : ""
                  }`}
                >
                  Schedule
                  {location.pathname === "/schedule" && (
                    <span className="sr-only">(current)</span>
                  )}
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <Link
                  to="/fields"
                  className={`block py-2 px-3 rounded-md text-gray-700 dark:text-white ${
                    location.pathname === "/fields"
                      ? "bg-green-100 dark:bg-green-800"
                      : ""
                  }`}
                >
                  Fields
                  {location.pathname === "/fields" && (
                    <span className="sr-only">(current)</span>
                  )}
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <Link
                  to="/games"
                  className={`block py-2 px-3 rounded-md text-gray-700 dark:text-white ${
                    location.pathname === "/games"
                      ? "bg-green-100 dark:bg-green-800"
                      : ""
                  }`}
                >
                  Games
                  {location.pathname === "/games" && (
                    <span className="sr-only">(current)</span>
                  )}
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <Link
                  to="/search"
                  className={`block py-2 px-3 rounded-md text-gray-700 dark:text-white ${
                    location.pathname === "/search"
                      ? "bg-green-100 dark:bg-green-800"
                      : ""
                  }`}
                >
                  Search
                  {location.pathname === "/search" && (
                    <span className="sr-only">(current)</span>
                  )}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
