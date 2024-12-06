const loginViaAuth0Ui = (username, password) => {
  cy.visit('/')
  cy.get('button[data-testid="login-button"]').click();

  cy.origin(
    Cypress.env('auth0_domain'),

    { args: { username, password } },

    ({ username, password }) => {
      cy.get('input#username').type(username)
      cy.get('input#password').type(password, { log: false })
      cy.contains('button[value=default]', 'Continue').click()
    }
  )

  cy.url().should('equal', 'http://localhost:3000/')
}

Cypress.Commands.add('loginToAuth0', (username, password) => {
  cy.session(
    `auth0-${username}`,
    () => {loginViaAuth0Ui(username, password)},
    {validate: () => {
      cy.wrap(localStorage)
        .invoke('getItem', '@@auth0spajs@@::3AuqTtm3vGKzgR8EC8EgWpAFKluGjLyp::https://playvu.auth/::openid profile email')
        .should('exist')
    }}
  )
})

Cypress.Commands.add('getStripeInput', (selector) => {
  return cy.get('iframe[name^="__privateStripeMetricsController"]')
  .its('0.contentDocument') 
  .should('exist')
  .its('body') 
  .find('iframe[name^="__PrivateStripeFrame"]')
  .its('0.contentDocument') 
  .find('body')
  .then(body => {
    const cardField = body.find(selector)
    return cy.wrap(cardField)
  })
})