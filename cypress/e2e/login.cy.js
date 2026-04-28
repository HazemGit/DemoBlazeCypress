import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'


describe('Demoblaze Login Tests', () => {
  const homePage = new HomePage()
  const loginPage = new LoginPage()

  beforeEach(() => {
    homePage.goHome()
    homePage.clickLoginLink()
  })

  it('Should login successfully with valid credentials', () => {
    cy.fixture('users').then((users) => {
      loginPage.loginUser(users.validUser.username, users.validUser.password)
      homePage.assertLoggedInUser(users.validUser.username)
    })
  })

  it('Should show an error for wrong password', () => {
    cy.fixture('users').then((users) => {
      loginPage.loginUser(users.invalidUser.username, users.invalidUser.password)
      loginPage.assertWrongPasswordFailure()
      homePage.assertNoLoggedInUser()
    })
  })

  it('Should show an error for non existing user', () => {
    cy.fixture('users').then((users) => {
      loginPage.loginUser('Tal' + Date.now(), users.invalidUser.password)
      loginPage.assertNonExistingUserFailure()
      homePage.assertNoLoggedInUser()
    })
  })
})