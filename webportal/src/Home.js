import React from "react";
import FeatureCard from "./components/FeatureCard";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12">
      <header className="w-full max-w-5xl text-center mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-3xl shadow-xl py-10">
          <div className="max-w-sm">
            <h1 className="text-4xl font-extrabold mb-6">Playtime made easy</h1>
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

      <div className="bg-white rounded-3xl shadow-xl py-10 flex flex-col items-center my-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center ">Users</h1>
        <p className="max-w-3xl text-lg text-gray-600 mb-10 text-center mx-10">
          Provide players with a straightforward and flexible experience to
          find, join, and participate in local sports games.
        </p>
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <FeatureCard
            name={"Game Coordination"}
            description={
              "Effortlessly schedule games and notify team captains to keep \
        everyone in sync."
            }
          />

          <FeatureCard
            name={"Find and Join Nearby Games"}
            description={
              "Search for games in your area that you prefer, and join them with a few taps"
            }
          />

          <FeatureCard
            name={"Secure Payments"}
            description={
              "Pay fees through in-app Stripe integration and secure in-app transactions."
            }
          />

          <FeatureCard
            name={"Personalized Profile"}
            description={
              "Create a profile that represents your information to share with captains and field owners."
            }
          />

          {/* <FeatureCard
            name={"Instant Notifications"}
            description={
              "Stay informed with real-time updates for scheduling changes, field \
        availability, and more."
            }
          /> */}
        </section>
      </div>

      <div className="bg-white rounded-3xl shadow-xl py-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 text-center ">Captains</h1>
        <p className="max-w-3xl text-lg text-gray-600 mb-10 text-center mx-10">
          Enable captains to organize and manage games efficiently.
        </p>
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <FeatureCard
            name={"Create Games Quickly"}
            description={
              "Set up new games and venues, as well as coordinate with players and field owners"
            }
          />

          <FeatureCard
            name={"Reserve Fields and Invite Players"}
            description={
              "Browse available fields for games, reserve them, and let people join games"
            }
          />

          <FeatureCard
            name={"Monitor Players"}
            description={
              "Keep track of who joins games, manage teams, and share updates"
            }
          />
        </section>
      </div>

      <div className="bg-white rounded-3xl shadow-xl py-10 flex flex-col items-center mt-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center ">Owners</h1>
        <p className="max-w-3xl text-lg text-gray-600 mb-10 text-center mx-10">
          Maximize revenue by improving utilization and simplifying management
          for fields
        </p>
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <FeatureCard
            name={"List your fields"}
            description={
              "Showcase your field and facilities to an audience looking to book venues for players"
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
            name={"Update field availability information"}
            description={
              "Manage fields and sub field avaiablity for bookings in real-time"
            }
          />

          <FeatureCard
            name={"View Schedules At a Glance"}
            description={
              "Browse available fields for games, reserve them, and let people join games"
            }
          />
        </section>
      </div>
    </div>
  );
};

export default Home;
