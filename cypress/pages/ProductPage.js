class ProductPage {
    // Selectors
    #productContent = '.product-content'
    #name = 'h2.name'
    #price = 'h3.price-container'
    #desc = '#more-information p'
    #addToCartButton = "a[onclick*='addToCart']"

    getProductName() {
        return cy.get(this.#name).invoke('text')
    }

    getProductPrice() {
        return cy.get(this.#price).invoke('text')
    }

    getProductDesc() {
        return cy.get(this.#desc).invoke('text')
    }

    clickAddToCart() {
        cy.get(this.#addToCartButton).click()
    }

    getProductData() {
        return cy.get(this.#productContent).then((product) => {
            // product is a wrapped JQuery element, so we can use JQuery methods (the then block is sync so we can use normal JS code)
            const productData = {
                name: product.find(this.#name).text().trim(),
                price: product.find(this.#price).text().trim().replace('$', '').split(' ')[0],
                desc: product.find(this.#desc).text().trim()
            }
            // return the created object to the Cypress async chain
            return productData
        })
    }

    assertProductAdded() {
        // Retrieve window object (the browser window)
        cy.window().then((win) => {
            // Stub the window alert method to record its usage
            cy.stub(win, 'alert').as('alert')
        })
        // Verify that the alert with called with the correct text
        cy.getString('PlaceOrderProductAdded').then((string) => {
            cy.get('@alert').should('have.been.calledWithMatch', string)

        })
    }
}

export default ProductPage