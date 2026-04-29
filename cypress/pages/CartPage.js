import cypressConfig from "../../cypress.config"

class CartPage {
  // Selectors
  #productsTable = '#tbodyid'
  #totalPrice = '#totalp'
  #placeOrderButton = 'button[data-target="#orderModal"]'
  // Add products table columns in order here
  #productsTableColumns = Object.freeze({IMAGE:1, NAME:2, PRICE:3, DELETE:4}) 
  #productsTablePrices = 'td:nth-child(' + (this.#productsTableColumns.PRICE) + ')'

  getProductName(idx) {
    return cy.get(this.#productsTable).find('tr').eq(idx -1).find('td').eq(this.#productsTableColumns.NAME - 1)
      .invoke('text')
      .then((text) => text.trim())
  }

   getProductPrice(idx) {
    return cy.get(this.#productsTable).find('tr').eq(idx -1).find('td').eq(this.#productsTableColumns.PRICE - 1)
      .invoke('text')
      .then((text) => text.trim())
  }

  getTotalPrice() {
    return cy.get(this.#totalPrice).invoke('text')
  }

  clickPlaceOrderButton() {
    cy.get(this.#placeOrderButton).click()
  }

  clickDeleteLink(idx) {
    cy.get(this.#productsTable).find('tr').eq(idx -1).find('td').eq(this.#productsTableColumns.DELETE - 1).find('a').click()
  }

  assertCountOfProducts(productsCount) {
    cy.get(this.#productsTable).find('tr').should('have.length', productsCount)
  }

  assertTotalPrice() {
    // Get all the prices as JQuery element wrapper
    cy.get(this.#productsTable).find(this.#productsTablePrices).then((cells) => {
      // we can use sync code in the then block, convert to an array of the inner text of the cells
      const totals = cells.toArray().map(el => el.innerText)
      .map(parseFloat) // convert from string to float so we can sum
      // calculate the sum
      const sum = Cypress._.sum(totals)
      // Assert the total label displays a correct value
      cy.get(this.#totalPrice).invoke('text').should('eq', String(sum))
    })
  }
}

export default CartPage