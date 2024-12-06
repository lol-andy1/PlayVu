import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: true,
  },
  env: {
    auth0_username: "andy3",
    auth0_password: "Shshsh89!",
    auth0_domain: "https://dev-1jps85kh7htbmqki.us.auth0.com/oauth/token",
    auth0_audience: "https://playvu.auth/",
    auth0_client_id: "3AuqTtm3vGKzgR8EC8EgWpAFKluGjLyp",
  }
});
