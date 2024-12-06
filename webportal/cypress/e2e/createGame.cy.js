describe('Create a game as an organizer', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr'); 

    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
  })

  it('Create a 2 hour game on Dec 5th 4:00 pm at Penberthy subfield 1', () => {
    cy.visit('/')
    cy.get('button[data-testid="nav-toggle"]').click()

    cy.intercept('GET', '/api/get-organizer-games', {
      statusCode: 200
    })
    cy.get('[data-testid="organize-link"]').click()
    cy.url().should('equal', 'http://localhost:3000/organize/games')
    cy.get('button[data-testid="nav-toggle"]').click()

    cy.get('button[data-testid="create-game"]').click()

    cy.url().should('equal', 'http://localhost:3000/organize/select-field')

    cy.fixture('mockFields.json').then((data) => {
      cy.intercept('GET', '/api/get-fields-by-name?name=penb', {
        statusCode: 200,
        body: data
      })
    })
    cy.get('input[name="search-field"]').type('penb')

    cy.fixture('mockSchedule.json').then((data) => {
      cy.intercept('GET', '/api/get-subfield-schedules?subFieldId=38', {
        statusCode: 200,
        body: data
      })
    })

    cy.get('[data-testid="field12"]').click()
    cy.get('[data-testid="subfield38"]').click()
    cy.url().should('equal', 'http://localhost:3000/organize/select-time')
    cy.get('[data-testid="next-day"]').click()
    cy.get('h1[data-testid="selected-day"]').should('have.text', '12/5/2024')
    cy.get('[data-testid="duration-slider"]').click(150, 10)
    cy.get('div[data-testid="04:00 PM"]').click()
    cy.get("Button[data-testid='done']").click()

    cy.url().should('equal', 'http://localhost:3000/organize/configure')
    cy.get('input[name="game-name"]').clear().type("Test Game")
    cy.get('[data-testid="player-count-slider"]').click(100, 10)
    cy.get('input[name="price"]').type('5')
    cy.get("Button[data-testid='done']").click()

    cy.url().should('equal', 'http://localhost:3000/organize/confirm')

    cy.intercept('POST', '/api/add-game', {
      statusCode: 200,
    }).as('addGame')
    cy.get('button[data-testid="confirm"]').click()

    cy.wait('@addGame')
    cy.get('body').click();
    cy.wait(3000)
    //cy.getStripeInput('input[name="number"]').type('4242424242424242')
    // cy.getStripeInput('input[name="expiry"]').type('0129')
    // cy.getStripeInput('input[name="cvc"]').type('111')
    // cy.getStripeInput('input[name="postalCode"]').type('11111')
    // cy.window().trigger('keydown', { key: 'Tab' })
    // cy.contains('button', 'Pay').click();

    // cy.contains('button', 'Pay').click();

  });
});