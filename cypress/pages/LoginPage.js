import cypressConfig from "../../cypress.config"

class LoginPage {
  // Selectos

  #fieldUsername = '#loginusername'
  #fieldPassword = '#loginpassword'
  #buttonLogin = "button[onclick='logIn()']"

  setUsername(username) {
    // using invoke('val',username) as type sometimes doesn't type the full text at the first field, seems like it's a cypress issue https://github.com/cypress-io/cypress/issues/5480
    cy.get(this.#fieldUsername).clear().invoke('val', username)
  }

  setPassword(password) {
    cy.get(this.#fieldPassword).clear().type(password)
  }

  clickLoginLink() {
    cy.get(this.#buttonLogin).click()
  }

  loginUser(user, password) {
    this.setUsername(user)
    this.setPassword(password)
    this.clickLoginLink()
  }

  assertWrongPasswordFailure() {
    // Retrieve window object (the browser window)
    cy.window().then((win) => {
      // Stub the window alert method to record its usage
      cy.stub(win, 'alert').as('alert')
    })
    // Verify that the alert with called with the correct text
    cy.getString('loginWrongPassword').then((string) => {
      cy.get('@alert').should('have.been.calledWithMatch', string)
    })
  }

  assertNonExistingUserFailure() {
    // Retrieve window object (the browser window)
    cy.window().then((win) => {
      // Stub the window alert method to record its usage
      cy.stub(win, 'alert').as('alert')
    })
    // Verify that the alert with called with the correct text
    cy.getString('loginUserDoesNotExist').then((string) => {
      cy.get('@alert').should('have.been.calledWithMatch', string)
    })
  }
}

export default LoginPage