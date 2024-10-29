import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12">
      <header className="w-full max-w-3xl text-center mb-12 px-4">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Welcome to Your Sports Field Management Portal
        </h1>
        <p className="text-lg text-gray-700">
          A powerful tool for field owners and team captains to effortlessly
          manage field schedules, game events, and communications.
        </p>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-500 mb-2">
            Field Management
          </h2>
          <p className="text-gray-600">
            Update availability, assign subfields, and keep schedules organized
            with ease.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-500 mb-2">
            Game Coordination
          </h2>
          <p className="text-gray-600">
            Effortlessly schedule games and notify team captains to keep
            everyone in sync.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-500 mb-2">
            Availability Optimization
          </h2>
          <p className="text-gray-600">
            Enable captains to reserve fields based on real-time availability,
            simplifying booking for all teams.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-500 mb-2">
            Instant Notifications
          </h2>
          <p className="text-gray-600">
            Stay informed with real-time updates for scheduling changes, field
            availability, and more.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
