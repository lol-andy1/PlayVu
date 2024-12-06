require("dotenv").config();
import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    video: true,
  },
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: "https://" + process.env.REACT_APP_DOMAIN + "/oauth/token",
    auth0_audience: "https://playvu.auth/",
    auth0_client_id: process.env.REACT_APP_CLIENT_ID,
    backendUrl: process.env.REACT_APP_BACKEND_URL,
  },
});
