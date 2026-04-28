import cypressConfig from "../../cypress.config"

class PlaceOrderPage {
  // Selectors
  #total = '#totalm'
  #name = '#name'
  #country = '#country'
  #city = '#city'
  #creditCardNumber = '#card'
  #month = '#month'
  #year = '#year'
  #purchaseButton = 'button[onclick="purchaseOrder()"]'
  #confirmTitle = 'div.sweet-alert > h2'
  #confirmText = 'div.sweet-alert p'
  #confirmOkButton = 'div.sweet-alert button.confirm'

  setName(name) {
    // using invoke('val',name) as type sometimes doesn't type the full text at the first field, seems like it's a cypress issue https://github.com/cypress-io/cypress/issues/5480
    cy.get(this.#name).invoke('val', (name))
  }

  setCountry(country) {
    cy.get(this.#country).clear().type(country)
  }

  setCity(city) {
    cy.get(this.#city).clear().type(city)
  }

  setCreditCardNumber(number) {
    cy.get(this.#creditCardNumber).clear().type(number)
  }

  setCreditCardMonth(month) {
    cy.get(this.#month).clear().type(month)
  }

  setCreditCardYear(year) {
    cy.get(this.#year).clear().type(year)
  }

  clickPurchaseButton() {
    cy.get(this.#purchaseButton).click()
  }

  clickPurchaseConfirmOkButton() {
    cy.get(this.#confirmOkButton).click()
  }

  setAllFormData() {
    cy.fixture("users").then((users) => {
      this.setName(users.validUser.name)
      this.setCountry(users.validUser.country)
      this.setCity(users.validUser.city)
      this.setCreditCardNumber(users.validUser.creditCardNumber)
      this.setCreditCardMonth(users.validUser.creditCardMonth)
      this.setCreditCardYear(users.validUser.creditCardYear)
    })
  }

  getTotalAmount() {
    // The format is like: "Total: 1580". This will return only the amount part
    return cy.get(this.#total).invoke('text').then((text) => {
      return text.trim().split(' ')[1]
    })
  }

  assertMissingDataAlert() {
    // Retrieve window object (the browser window)
    cy.window().then((win) => {
      // Stub the window alert method to record its usage
      cy.stub(win, 'alert').as('alert')
    })
    // This should trigger the alert when clicked with the required data missing
    this.clickPurchaseButton()
    // Verify that the alert with called with the correct text
    cy.getString('PlaceOrderPleaseFillOutNameAndCreditcard').then((string) => {
      cy.get('@alert').should('have.been.calledWithMatch', string)
    })
  }

  assertPurchaseConfirmation(amount) {
    cy.getString('PlaceOrderThankYouForYourPurchase').then((string) => {
      cy.get(this.#confirmTitle).should('have.text', string)
    })
    // Assert amount and user data is correct
    cy.get(this.#confirmText).should('contain.text', amount)
    cy.fixture("users").then((users) => {
      cy.get(this.#confirmText).should('contain.text', users.validUser.creditCardNumber)
      cy.get(this.#confirmText).should('contain.text', users.validUser.creditCardNumber)
      cy.get(this.#confirmText).should('contain.text', users.validUser.name)
    })
    // Assert the date is today's date
    const today = new Date();
    const day = today.getDate()
    const month = today.getMonth() + 1 // January is 0
    const year = today.getFullYear();
    // TODO comment this line if you want to ignore the existing wrong month web app bug and all tests to be green
    cy.get(this.#confirmText).should('contain.text', day + '/' + month + '/' + year)
  }

}

export default PlaceOrderPage