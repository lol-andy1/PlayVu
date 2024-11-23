import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import axios from "axios";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// console.log(process.env);

const domain = process.env.REACT_APP_DOMAIN;
const clientId = process.env.REACT_APP_CLIENT_ID;
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
// const stripePromise = loadStripe(process.env.STRIPE_API_KEY);

// const stripe_options = {
//   // passing the client secret obtained from the server
//   clientSecret: "{{CLIENT_SECRET}}",
// };

if (!domain || !clientId) {
  console.error(
    "Missing auth params. Ensure REACT_APP_DOMAIN and REACT_APP_CLIENT_ID is set in your .env file.",
  );
}

if (!axios.defaults.baseURL) {
  console.error(
    "Missing backend URL. Ensure REACT_APP_BACKEND_URL is set in your .env file.",
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: "https://playvu.auth/",
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      {/* <Elements stripe={stripePromise} options={stripe_options}> */}
      <App />
      {/* </Elements> */}
    </Auth0Provider>
  </React.StrictMode>,
);
