import cypressConfig from "../../cypress.config"

class HomePage {
    // Selectors
    #mainMenuLogin = '#login2'
    #mainMenuLoggedinUser = '#nameofuser'
    #mainMenuCart = '#cartur'
    #navCategoriesLaptops = `a[onclick="byCat('notebook')"]`
    #productCards = '.card'
    #productLinks = '.card .card-title a'
    #productTitles = '.card-title'
    #productPrices = '.card-block h5'
    #productDescs = '#article'

    goHome() {
        cy.visit(cypressConfig.e2e.baseUrl)
    }

    clickLoginLink() {
        cy.get(this.#mainMenuLogin).click()
    }

    clickCartLink() {
        // Intercept and Wait for the API call to finish
        cy.intercept('/viewcart').as('viewcart')
        cy.get(this.#mainMenuCart).click()
        cy.wait('@viewcart', { timeout: cypressConfig.e2e.longCommandsTimeout })
    }

    clickCategoriesLaptopsLink() {
        // Intercept and Wait for the API call
        cy.intercept('/bycat').as('byCategoryAPICall')
        cy.get(this.#navCategoriesLaptops).click()
        cy.wait('@byCategoryAPICall', { timeout: cypressConfig.e2e.longCommandsTimeout })
    }

    getProductData(idx) {
        return cy.get(this.#productCards).eq(idx - 1).then((product) => {
            // product is a wrapped JQuery element, so we can use JQuery methods (the then() block is sync so we can use normal JS code)
            const productData = {
                name: product.find(this.#productTitles).text().trim(),
                price: product.find(this.#productPrices).text().trim(),
                desc: product.find(this.#productDescs).text().trim()
            }
            // return the created object to the Cypress async chain
            return productData
        })
    }

    clickProductLink(idx) {
        cy.get(this.#productLinks).eq(idx - 1).click()
    }

    assertProductsCountAtLeast(count) {
        cy.get(this.#productCards).should('have.length.least', count)
    }

    assertLoggedInUser(username) {
        cy.get(this.#mainMenuLoggedinUser)
            .should('be.visible')
            .and('contain', username)
    }
    assertNoLoggedInUser() {
        cy.get(this.#mainMenuLoggedinUser)
            .should('not.be.visible')
    }
}

export default HomePage