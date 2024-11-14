import React from "react";
import FeatureCard from "./components/FeatureCard";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12">
      <header className="w-full max-w-3xl text-center mb-12 px-4">
        <h1 className="text-fit text-9xl font-bold text-gray-800 mb-4">
          PlayVu
        </h1>
        <p className="text-lg text-gray-700">
          {/* Connecting players, game organizers (captains), and field owners to
          effortlessly manage and streamline recreational sports activities.
          Enabling easy joining of games, through simplified booking and
          payments.  */}
          Organizing and participating in casual sports is more accessible and
          enjoyable for everyone!
        </p>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <FeatureCard
          name={"Field Management"}
          description={
            "Update availability, assign subfields, and keep schedules organized with ease."
          }
        />

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
