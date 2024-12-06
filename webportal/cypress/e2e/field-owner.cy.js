describe("Testing all field owner functionalities", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    cy.loginToAuth0(
      Cypress.env("auth0_username"),
      Cypress.env("auth0_password")
    );
  });
  it("Login and navigate to field owner page", () => {
    cy.visit("/");
    cy.get('[data-testid="owner-link"]').click();
    cy.url().should("include", "/FieldOwner");
  });

  it("Create field", () => {
    cy.visit("/");
    cy.get('[data-testid="owner-link"]').click();

    cy.get('button[data-testid="add-field"]').click();

    cy.get('input[name="name"]').type("Soccer Field");
    cy.get('input[name="streetAddress"]').type("123 Pen St");
    cy.get('input[name="zipCode"]').type("12345");
    cy.get('input[name="city"]').type("College Station");
    cy.get('input[name="price"]').type("150");
    cy.get('input[name="picture"]').type(
      "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?cs=srgb&dl=pexels-akos-szabo-145938-440731.jpg&fm=jpg"
    );
    cy.get('textarea[name="description"]').type(
      "A well-maintained soccer field ideal for matches and practice."
    );

    cy.intercept("POST", `/api/add-field`, (req) => {
      req.reply({
        statusCode: 200,
        body: { success: true, message: "Field added successfully!" },
      });
    }).as("addField");

    cy.contains("button", "Submit").click();

    cy.wait("@addField")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          name: "Soccer Field",
          description:
            "A well-maintained soccer field ideal for matches and practice.",
          address: "123 Pen St",
          zipCode: "12345",
          city: "College Station",
          price: "150",
          picture:
            "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?cs=srgb&dl=pexels-akos-szabo-145938-440731.jpg&fm=jpg",
        });
      });
  });

  it("Edit field", () => {
    cy.intercept("GET", "/api/get-owner-fields", {
      statusCode: 200,
      body: [
        {
          zipCode: "77840",
          address: "Penberthy Blvd",
          fieldName: "Penberthy Complex",
          city: "College Station",
          price: 30.0,
          description:
            "The Penberthy Rec Sports Complex is the Rec Sports department’s outdoor field facility.",
          subFields: [
            {
              name: "Field 1",
              data: [],
              subFieldId: 38,
            },
          ],
          picture:
            "https://recsports.tamu.edu/wp-content/uploads/MKTG_PEAP_1-1-scaled.jpg",
          fieldId: 12,
        },
      ],
    }).as("getOwnerFields");

    cy.intercept("POST", "/api/edit-field", {
      statusCode: 200,
      body: { success: true, message: "Field updated successfully!" },
    }).as("editField");

    cy.visit("/");

    cy.get('[data-testid="owner-link"]').click();

    cy.wait("@getOwnerFields");

    cy.get('button[data-testid="edit-field"]').first().click();

    cy.get('input[value="Penberthy Complex"]')
      .clear()
      .type("Updated Field Name");
    cy.get('input[value="Penberthy Blvd"]').clear().type("Updated Address");
    cy.get('input[value="77840"]').clear().type("12345");
    cy.get('input[value="College Station"]').clear().type("New City");
    cy.get('input[value="30"]').clear().type("50");
    cy.get(
      'input[value="https://recsports.tamu.edu/wp-content/uploads/MKTG_PEAP_1-1-scaled.jpg"]'
    )
      .clear()
      .type("https://example.com/updated-image.jpg");
    cy.get("textarea").clear().type("Updated description for the field.");

    cy.contains("button", "Save").click();

    cy.wait("@editField")
      .its("request.body")
      .should((body) => {
        expect(body).to.deep.include({
          fieldId: 12,
          name: "Updated Field Name",
          address: "Updated Address",
          zipCode: "12345",
          city: "New City",
          price: "50",
          picture: "https://example.com/updated-image.jpg",
          description: "Updated description for the field.",
        });
      });

    cy.get("#select-modal").should("not.exist");
  });

  it("Delete field", () => {
    cy.intercept("GET", "/api/get-owner-fields", {
      statusCode: 200,
      body: [
        {
          zipCode: "77840",
          address: "Penberthy Blvd",
          fieldName: "Penberthy Complex",
          city: "College Station",
          price: 30.0,
          description:
            "The Penberthy Rec Sports Complex is the Rec Sports department’s outdoor field facility.",
          subFields: [
            {
              name: "Field 1",
              data: [],
              subFieldId: 38,
            },
          ],
          picture:
            "https://recsports.tamu.edu/wp-content/uploads/MKTG_PEAP_1-1-scaled.jpg",
          fieldId: 12,
        },
      ],
    }).as("getOwnerFields");

    cy.intercept("POST", "/api/delete-field", {
      statusCode: 200,
      body: { success: true, message: "Field deleted successfully!" },
    }).as("deleteField");

    cy.visit("/");

    cy.get('[data-testid="owner-link"]').click();

    cy.wait("@getOwnerFields");

    cy.get('button[data-testid="delete-field"]').first().click();

    cy.contains("Are you sure?").should("exist");

    cy.get('button[data-testid="delete-modal-btn"]').click();

    cy.wait("@deleteField")
      .its("request.body")
      .should((body) => {
        expect(body).to.deep.equal({ fieldId: 12 });
      });

    cy.get('div[data-testid="delete-modal"]').should("not.exist");
  });

  it("Add field availability", () => {
    cy.intercept("GET", "/api/get-owner-fields", {
      statusCode: 200,
      body: [
        {
          zipCode: "77840",
          address: "Penberthy Blvd",
          fieldName: "Penberthy Complex",
          city: "College Station",
          price: 30.0,
          description:
            "The Penberthy Rec Sports Complex is the Rec Sports department’s outdoor field facility.",
          subFields: [
            {
              name: "Field 1",
              data: [],
              subFieldId: 38,
            },
          ],
          picture:
            "https://recsports.tamu.edu/wp-content/uploads/MKTG_PEAP_1-1-scaled.jpg",
          fieldId: 12,
        },
      ],
    }).as("getOwnerFields");

    cy.intercept("GET", "/api/get-field-schedules?fieldId=12", {
      statusCode: 200,
      body: [
        {
          name: "Field 1",
          data: [
            {
              type: "schedule",
              endDate: "2024-12-31T23:03:00Z",
              startDate: "2024-12-01T23:03:00Z",
              fieldScheduleId: 65,
            },
          ],
          subFieldId: 38,
        },
      ],
    }).as("getFieldSchedules");

    cy.intercept("POST", "/api/add-field-schedule", {
      statusCode: 200,
      body: { success: true, message: "Availability added successfully!" },
    }).as("addFieldSchedule");

    cy.visit("/");

    cy.get('[data-testid="owner-link"]').click();

    cy.contains("button", "Schedule Management").click();

    cy.wait("@getOwnerFields");

    cy.wait("@getFieldSchedules");

    cy.contains("button", "Add Availability").click();
    cy.get("select#subfield_select").select("38");
    cy.get("input#start_date_input").type("2024-12-05T09:00");
    cy.get("input#end_date_input").type("2024-12-05T17:00");
    cy.get('button[type="submit"]').click();

    cy.wait("@addFieldSchedule")
      .its("request.body")
      .should((body) => {
        expect(body).to.deep.equal({
          subFieldId: "38",
          startDate: new Date("2024-12-05T09:00").toISOString(),
          endDate: new Date("2024-12-05T17:00").toISOString(),
        });
      });

    cy.get('div[role="dialog"]').should("not.exist");
  });
});
