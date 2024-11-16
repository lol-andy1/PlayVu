import React from "react";
import FeatureCard from "./components/FeatureCard";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12">
      <header className="w-full max-w-5xl text-center mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-3xl shadow-xl py-10">
          <div className="max-w-sm">
            <h1 className="text-4xl font-extrabold mb-6">Playtime made eazy</h1>
            <p className="text-xl text-gray-700">
              Organizing and participating in casual sports is now easier and
              more enjoyable than ever! Join the community, find games, and make
              the most of your playtime.
            </p>
          </div>
          <div className="w-1/2 flex justify-center">
            <img
              src="logo.jpg"
              alt="PlayVu logo"
              className="h-80 w-80 object-contain"
            />
          </div>
        </div>
      </header>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <FeatureCard
          name={"Field Management"}
          description={
            "Update availability, assign subfields, and keep schedules organized with ease."
          }
        />

        <FeatureCard
          name={"Game Coordination"}
          description={
            "Effortlessly schedule games and notify team captains to keep \
        everyone in sync."
          }
        />

        <FeatureCard
          name={"Availability Optimization"}
          description={
            "Enable captains to reserve fields based on real-time availability, \
        simplifying booking for all teams."
          }
        />

        <FeatureCard
          name={"Instant Notifications"}
          description={
            "Stay informed with real-time updates for scheduling changes, field \
        availability, and more."
          }
        />
      </section>
    </div>
  );
};

export default Home;
