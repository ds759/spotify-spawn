const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const data = require("./data");
const fs = require("fs");

const randomTime = (max, min) => Math.floor(Math.random() * max + min);
const waitFor = ms => new Promise(r => setTimeout(r, ms));

const logToFile = (artist, timeListened, user, login, logout) => {
  let data = `{user: ${user}, loggedIn: ${login}, artist: ${artist}, playingTime: ${timeListened}ms, loggedOut: ${logout}}\n`;
  fs.appendFile("log.txt", data, function(err) {
    if (err) throw err;
    console.log("Updated Log!");
  });
};
async function main(user) {
  const options = new chrome.Options();

  options.setUserPreferences({
    "profile.default_content_setting_values.notifications": 2
  });
  options.addArguments("--no-sandbox");
  options.addArguments("-disable-dev-shm-usage");
  options.addArguments("--headless");

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    await driver.get("https://open.spotify.com/browse/featured");
    await waitFor(randomTime(2000, 1000));
    await driver.wait(
      until.elementLocated(
        By.className(
          "_2221af4e93029bedeab751d04fab4b8b-scss _1edf52628d509e6baded2387f6267588-scss"
        )
      )
    );
    await driver
      .findElement(
        By.className(
          "_2221af4e93029bedeab751d04fab4b8b-scss _1edf52628d509e6baded2387f6267588-scss"
        )
      )
      .click();
    await waitFor(randomTime(2000, 1000));
    await driver.findElement(By.className("control-indicator")).click();
    await driver.wait(until.elementLocated(By.id("login-username")));
    await driver
      .findElement(By.id("login-username"))
      .sendKeys(user.name, Key.TAB, user.pass, Key.TAB, Key.ENTER);
    let LOGIN = new Date();
    LOGIN = LOGIN.toUTCString();
    await waitFor(randomTime(2000, 1000));
    await driver
      .wait(until.elementLocated(By.className("search-icon")))
      .click();
    const randomSong = Math.floor(Math.random() * (data.songs.length - 1) + 1);
    const artist = data.songs[randomSong];
    await driver
      .wait(
        until.elementLocated(
          By.className("_2f8ed265fb69fb70c0c9afef329ae0b6-scss")
        )
      )
      .sendKeys(data.songs[randomSong], Key.ENTER);
    await waitFor(randomTime(2000, 1000));
    await driver
      .wait(
        until.elementLocated(
          By.className("f79dd23c27c3352da3ac3ba62d78f8ea-scss")
        )
      )
      .click();
    await driver.wait(until.elementLocated(By.className("position-outer")));
    const songs = await driver.findElements(By.className("position-outer"));
    const playButton = await driver.findElements(
      By.className("control-button spoticon-play-16 control-button--circled")
    );
    const songIndex = Math.floor(Math.random() * 5 + 1);
    songs.forEach((element, index) => {
      if (index === songIndex) {
        element.click();
        setTimeout(() => {
          element.click();
        }, 200);
        setTimeout(() => {
          element.click();
          if (playButton[0]) playButton[0].click();
        }, 200);
      }
    });
    const TIMEPLAYED = randomTime(9300, 5100);
    await waitFor(TIMEPLAYED);
    await driver
      .wait(
        until.elementLocated(
          By.className("_19813d13f17b9971773e54f5957ee593-scss")
        )
      )
      .click();

    const actions = await driver.findElements(
      By.className("_5d8857b271ece35ed4dd191b5b15f48e-scss")
    );
    await waitFor(randomTime(1000, 500));
    const actionIndex = 2;
    actions.forEach((element, index) => {
      if (index === actionIndex) {
        element.click();
      }
    });
    let LOGGED_OUT = new Date();
    LOGGED_OUT = LOGGED_OUT.toUTCString();
    logToFile(artist, TIMEPLAYED, user.name, LOGIN, LOGGED_OUT);
  } finally {
    try {
      await driver.quit();
    } finally {
      console.log("done");
    }
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const start = async () => {
  await asyncForEach(data.users, async user => {
    await waitFor(randomTime(5000, 3000));
    await main(user);
  });
};

start();
