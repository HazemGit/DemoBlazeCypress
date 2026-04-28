import cypressConfig from "../../cypress.config"
import HomePage from "../pages/HomePage"
import ProductPage from "../pages/ProductPage"
import CartPage from "../pages/CartPage"
import PlaceOrderPage from "../pages/PlaceOrderPage"


describe('Demoblaze purchase tests', () => {
    const homePage = new HomePage()
    const productPage = new ProductPage()
    const cartPage = new CartPage()
    const placeOrderPage = new PlaceOrderPage()

    beforeEach(() => {
        homePage.goHome()
    })
    it('Purchases multiple laptops beginning to end', () => {
        homePage.clickCategoriesLaptopsLink();
        // Make sure we have at least two laptops
        homePage.assertProductsCountAtLeast(2);
        // Buy 2 laptops
        for (let i = 1; i <= 2; i++) {
            // Buy the first laptop
            homePage.clickProductLink(i)
            productPage.clickAddToCart()
            productPage.assertProductAdded()
            homePage.goHome()
            homePage.clickCategoriesLaptopsLink();
        }
        homePage.clickCartLink()
        // assert that we have two products in the cart
        cartPage.assertCountOfProducts(2)
        cartPage.clickPlaceOrderButton()
        // Fill in the form data and continue
        placeOrderPage.setAllFormData()
        // Get the total from the place order and confirm the purchase
        placeOrderPage.getTotalAmount().then((amount) => {
            placeOrderPage.clickPurchaseButton()
            // This will fail when checking the date, since there's a bug in the web app: The month part in the app is last month!
            placeOrderPage.assertPurchaseConfirmation(amount)
            placeOrderPage.clickPurchaseConfirmOkButton()
        })
        // Cart should be empty now 
        homePage.clickCartLink()
        cartPage.assertCountOfProducts(0)
    })
    it('Cannot purchase without entering a credit card number', () => {
        homePage.clickCategoriesLaptopsLink();
        // Make sure we have at least two laptops
        homePage.assertProductsCountAtLeast(2);
        // Add a laptop to cart
        homePage.clickProductLink(2)
        productPage.clickAddToCart()
        productPage.assertProductAdded()
        homePage.goHome()
        homePage.clickCartLink()
        // assert that we one laptop in the cart
        cartPage.assertCountOfProducts(1)
        cartPage.clickPlaceOrderButton()
        cy.fixture("users").then((users) => {
            placeOrderPage.setName(users.validUser.name)
        })
        // Make sure we get an error when missing name and/or credit card number
        placeOrderPage.clickPurchaseButton()
        placeOrderPage.assertMissingDataAlert()
        // Cart should still have the laptop, since the order didn't complete 
        homePage.goHome()
        homePage.clickCartLink()
        cartPage.assertCountOfProducts(1)
    })
    it('Cannot buy without entering a name', () => {
        homePage.clickCategoriesLaptopsLink();
        // Make sure we have at least two laptops
        homePage.assertProductsCountAtLeast(1);
        // Add a laptop to cart
        homePage.clickProductLink(1)
        productPage.clickAddToCart()
        productPage.assertProductAdded()
        homePage.goHome()
        homePage.clickCartLink()
        // assert that we one laptop in the cart
        cartPage.assertCountOfProducts(1)
        cartPage.clickPlaceOrderButton()
        cy.fixture("users").then((users) => {
            placeOrderPage.setCreditCardNumber(users.validUser.creditCardNumber)
        })
        // Make sure we get an error when missing name and/or credit card number
        placeOrderPage.clickPurchaseButton()
        placeOrderPage.assertMissingDataAlert()
        // Cart should still have the laptop, since the order didn't complete 
        homePage.goHome()
        homePage.clickCartLink()
        cartPage.assertCountOfProducts(1)
    })
    it('Checks product data consistency between homepage and product details page', () => {
        // Select any random index of a product
        const productIdx = 3
        homePage.clickCategoriesLaptopsLink()
        // Make sure that we have at least the number of available products
        homePage.assertProductsCountAtLeast(productIdx);
        // confirm the product data
        homePage.getProductData(productIdx).then((product) => {
            homePage.clickProductLink(productIdx)
            productPage.getProductName().should('eq', product.name)
            productPage.getProductPrice().should('contain', product.price)
            productPage.getProductDesc().should('eq', product.desc)
        })
    })
    it('Checks product data consistency between product details and cart pages', () => {
        // Select any random index of a product
        const productIdx = 3
        homePage.clickCategoriesLaptopsLink()
        // Make sure that we have at least the number of available products
        homePage.assertProductsCountAtLeast(productIdx);
        homePage.clickProductLink(productIdx);
        productPage.clickAddToCart()
        productPage.assertProductAdded()
        // confirm the product data
        productPage.getProductData().then((product) => {
            homePage.clickCartLink()
            cartPage.assertCountOfProducts(1)
            cartPage.getProductName(1).should('eq', product.name)
            cartPage.getProductPrice(1).should('eq', product.price)
        })
    })
})


