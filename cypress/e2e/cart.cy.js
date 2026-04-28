import HomePage from "../pages/HomePage"
import ProductPage from "../pages/ProductPage"
import CartPage from "../pages/CartPage"

describe('Demoblaze shopping cart tests', () => {
    const homePage = new HomePage()
    const productPage = new ProductPage()
    const cartPage = new CartPage()

    beforeEach(() => {
        cy.fixture("users").then((users) => {
            homePage.goHome()
        })
    })

    it('Confirms that total price is calculated correctly', () => {
        homePage.clickCategoriesLaptopsLink()
        // Make sure we have at least three products
        homePage.assertProductsCountAtLeast(3);
        // Add three products to the cart
        for (let i = 1; i <= 3; i++) {
            homePage.clickProductLink(i);
            productPage.clickAddToCart()
            productPage.assertProductAdded()
            homePage.goHome()
            homePage.clickCategoriesLaptopsLink()
        }
        homePage.clickCartLink()
        cartPage.assertCountOfProducts(3)
        cartPage.assertTotalPrice()
    })

    it('Confirms deleting products from the shopping cart', () => {
        homePage.clickCategoriesLaptopsLink()
        // Make sure we have at least two products
        homePage.assertProductsCountAtLeast(2);
        // Add three products to the cart
        for (let i = 1; i <= 2; i++) {
            homePage.clickProductLink(i);
            productPage.clickAddToCart()
            productPage.assertProductAdded()
            homePage.goHome()
            homePage.clickCategoriesLaptopsLink()

        }
        homePage.clickCartLink()
        cartPage.assertCountOfProducts(2)
        cartPage.getProductName(1).then((firstProductName) => {
            // Delete the second item
            cartPage.clickDeleteLink(2)
            // Now we should have one item in the cart
            cartPage.assertCountOfProducts(1)
            // But did we delete the right item?
            cartPage.getProductName(1).should('eq', firstProductName)
        })
    })

})
