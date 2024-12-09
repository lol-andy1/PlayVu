describe("Search Page Functionality", () => {
    beforeEach(() => {
      cy.viewport("iphone-xr");
  
      cy.loginToAuth0(
        Cypress.env("auth0_username"),
        Cypress.env("auth0_password")
      );
  
      cy.visit("/");
      cy.get('button[data-testid="nav-toggle"]').click();
      cy.get('[data-testid="search-link"]').click();
      cy.url().should("include", "/search");
      cy.get('button[data-testid="nav-toggle"]').click();
    });
  
    it("should display all the UI elements", () => {
      cy.get("h1").should("contain.text", "Search for Games");
      cy.get("input[type='range']").should("exist");
      cy.get("button").contains("Search By My Location").should("exist");
      cy.get("input[type='text']").should("exist");
      cy.get("select#sort").should("exist");
    });
  
    it("should adjust the distance range slider and display updated value", () => {
      cy.get("input[type='range']").as("distanceSlider");
      cy.get("input[type='range']").as("distanceSlider");

      cy.get("@distanceSlider").then(($slider) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
      
        nativeInputValueSetter.call($slider[0], 50); // Set the value to 50
      
        const event = new Event("input", { bubbles: true });
        $slider[0].dispatchEvent(event); // Trigger the input event
      });
      cy.wait(100);
      cy.contains("Selected Distance: 50 miles").should("exist");
    });
  
    it("should load and display game cards with mock data", () => {
        cy.intercept("GET", "/api/get-games*", {
            fixture: "games.json",
          }).as("getGames");
        cy.stubGeolocation({
            latitude: 37.7749,
            longitude: -122.4194,
        });
      
        cy.get("button").contains("Search By My Location").click();
        cy.contains("Pickup Soccer").should("exist");
        cy.contains("San Francisco, CA").should("exist");
        cy.contains("$15").should("exist");
        cy.contains("10 / 20 players").should("exist");
    });
  
    it("should search for games using geolocation", () => {
        cy.intercept("GET", "/api/get-games*", {
            fixture: "games.json",
          }).as("getGames");
        cy.stubGeolocation({
            latitude: 37.7749,
            longitude: -122.4194,
        });
      
        cy.get("button").contains("Search By My Location").click();
  
        cy.contains("Pickup Soccer").should("exist");
    });
  
    it("should search for games manually by entering a location", () => {
      cy.intercept("GET", "https://api.opencagedata.com/geocode/v1/json*", {
        body: {
          results: [
            {
              geometry: { lat: 37.7749, lng: -122.4194 },
            },
          ],
        },
      }).as("geocode");
      cy.intercept("GET", "/api/get-games*", {
        fixture: "games.json",
      }).as("getGames");
      cy.stubGeolocation({
        latitude: 37.7749,
        longitude: -122.4194,
    });
      cy.get("input[type='text']")
        .type("San Francisco, CA")
        .should("have.value", "San Francisco, CA");
      cy.get("button").contains("Search").click();
  
      cy.contains("Pickup Soccer").should("exist");
    });
  
    it("should sort games by price", () => {
        cy.intercept("GET", "/api/get-games*", {
            fixture: "games.json",
          }).as("getGames");
        cy.stubGeolocation({
            latitude: 37.7749,
            longitude: -122.4194,
        });
      
        cy.get("button").contains("Search By My Location").click();
  
      cy.get("select#sort").select("price");
      cy.contains("Futsol").should("exist");
    });
  
    it("should sort games by number of players", () => {
        cy.intercept("GET", "/api/get-games*", {
            fixture: "games.json",
          }).as("getGames");
        cy.stubGeolocation({
            latitude: 37.7749,
            longitude: -122.4194,
        });
      
        cy.get("button").contains("Search By My Location").click();
  
      cy.get("select#sort").select("players");
      cy.contains("Conner's Soccer").should("exist");
    });
  
    it("should display a message when no games are found", () => {
      cy.intercept("GET", "/api/get-games*", {
        body: [],
      }).as("emptyGames");
  
      cy.contains("No games found. Try adjusting your search criteria.").should(
        "exist"
      );
    });
  
    it("should show a loading state while fetching games", () => {
        cy.intercept("GET", "/api/get-games*", (req) => {
            req.reply((res) => {
            res.delay(1000); // Simulate a delay
            res.send({ fixture: "games.json" });
            });
        }).as("getGames");
        cy.stubGeolocation({
            latitude: 37.7749,
            longitude: -122.4194,
        });
  
        cy.get("button").contains("Search By My Location").click();
        cy.get("p").contains("Loading games...").should("exist");
    });
  });
  
  // Custom command for mocking geolocation
  Cypress.Commands.add("stubGeolocation", (coords) => {
    cy.window().then((win) => {
      const stubGeolocation = {
        getCurrentPosition: (success) => {
          success({
            coords: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          });
        },
      };
      cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(
        stubGeolocation.getCurrentPosition
      );
    });
  });
  