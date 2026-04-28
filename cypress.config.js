module.exports = {
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'https://www.demoblaze.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    lang: 'en',
    longCommandsTimeout: 10000,
  },
};