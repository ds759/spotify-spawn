const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const waitFor = ms => new Promise(r => setTimeout(r, ms));
const run = async () => {
  const options = setOptions();
  let driver = await createDriver(options);
  try {
    await openSite(driver);
    await waitFor(12000);
  } finally {
    driver.quit();
  }
};

const setOptions = () => {
  const options = new chrome.Options();
  options.setUserPreferences({
    "profile.default_content_setting_values.notifications": 2
  });
  // options.addArguments("--no-sandbox");
  // options.addArguments("-disable-dev-shm-usage");
  // options.addArguments("--headless");
  return options;
};
const createDriver = options => {
  return new Promise(resolve => {
    resolve(
      new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build()
    );
  });
};
const openSite = driver => {
  return new Promise(resolve => {
    driver.get("https://open.spotify.com/browse/featured").then(resolve());
  });
};

run();
