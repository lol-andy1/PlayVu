import React from "react";
import FeatureCard from "./components/FeatureCard";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-12">
      {/* Header Section */}
      <header className="w-full max-w-7xl text-center mb-12 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-3xl shadow-lg p-10">
          <div className="max-w-lg text-left space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
              Playtime Made Easy
            </h1>
            <p className="text-xl text-gray-600">
              Organizing and participating in casual sports has never been this
              simple. Join the community, find games, and make every moment of
              your playtime count.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex justify-center">
            <img
              src="logo.jpg"
              alt="PlayVu logo"
              className="h-64 w-64 object-contain shadow-md rounded-lg"
            />
          </div>
        </div>
      </header>

      {/* Users Section */}
      <section className="w-full bg-gray-50 rounded-3xl shadow-lg py-12 my-10 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Users</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-4">
            Provide players with a straightforward and flexible experience to
            find, join, and participate in local sports games.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            name="Game Coordination"
            description="Effortlessly schedule games and notify team captains to keep everyone in sync."
          />
          <FeatureCard
            name="Find and Join Nearby Games"
            description="Search for games in your area and join them with just a few taps."
          />
          <FeatureCard
            name="Secure Payments"
            description="Pay fees through in-app Stripe integration and secure in-app transactions."
          />
          <FeatureCard
            name="Personalized Profile"
            description="Create a profile that represents you and share it with captains and field owners."
          />
        </div>
      </section>

      {/* Captains Section */}
      <section className="w-full bg-white rounded-3xl shadow-lg py-12 my-10 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Captains</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-4">
            Enable captains to organize and manage games efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            name="Create Games Quickly"
            description="Set up new games and venues, as well as coordinate with players and field owners."
          />
          <FeatureCard
            name="Reserve Fields and Invite Players"
            description="Browse available fields for games, reserve them, and let people join."
          />
          <FeatureCard
            name="Monitor Players"
            description="Keep track of who joins games and manage teams effortlessly."
          />
        </div>
      </section>

      {/* Owners Section */}
      <section className="w-full bg-gray-100 rounded-3xl shadow-lg py-12 my-10 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Owners</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-4">
            Maximize revenue by improving utilization and simplifying
            management for fields.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FeatureCard
            name="List Your Fields"
            description="Showcase your fields and facilities to attract bookings from players and captains."
          />
          <FeatureCard
            name="Availability Optimization"
            description="Enable captains to reserve fields based on real-time availability."
          />
          <FeatureCard
            name="Update Availability"
            description="Manage fields and sub-field availability for bookings in real-time."
          />
          <FeatureCard
            name="View Schedules At a Glance"
            description="Easily browse and manage schedules to ensure optimal utilization."
          />
        </div>
        <div className="text-center mb-2">
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-4">
            Are you a field owner and wish to partner with PlayVu?
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = 'https://docs.google.com/forms/d/1I_mDvCTCtKZyuUH1ra9tnhd2H0Ru8dY9aHoY66At00w/prefill')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Request to Become a Partnered Field
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
