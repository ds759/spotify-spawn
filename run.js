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
const logError = (user, e) => {
  let data = `{error: 'true', user: ${user.name}, pass: ${user.pass}, time: ${e.date}, error: ${e.description}}\n`;
  fs.appendFile("log.txt", data, function(err) {
    if (err) throw err;
    console.log("Updated Error Log!");
  });
};
async function main(user) {
  let LOGIN_TIME;
  let ARTIST;
  let TIME_PLAYED;
  let LOGOUT_TIME;

  const options = setOptions();
  let driver = await createDriver(options);

  try {
    await openSite(driver);
    console.log("Opened Spotify!");
    await waitFor(randomTime(5500, 3500));

    await openLoginScreen(driver);
    await waitFor(randomTime(5500, 3500));

    await login(driver, user);
    LOGIN_TIME = getTime();
    console.log("Logged in @ " + LOGIN_TIME);
    await waitFor(randomTime(5500, 3500));

    ARTIST = await searchForSong(driver);
    await waitFor(randomTime(5500, 3500));

    await playSong(driver);
    TIME_PLAYED = await letSongPlay(driver);
    console.log("Played song for: " + TIME_PLAYED);

    await logout(driver);
    await waitFor(randomTime(5500, 3500));
    LOGOUT_TIME = getTime();

    await logToFile(ARTIST, TIME_PLAYED, user.name, LOGIN_TIME, LOGOUT_TIME);
    console.log("Written to log");
  } catch (e) {
    console.log("Error!!");
    console.log(e.code);
    console.log(e.description);
    console.log(e.date);
    await logError(user, e);
  } finally {
    await driver.quit();
    console.log("Driver Closed");
    console.log("-----------------------------");
    console.log();
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
  // start();
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
const openLoginScreen = driver => {
  return new Promise(resolve => {
    driver
      .wait(
        until.elementLocated(
          By.className(
            "_2221af4e93029bedeab751d04fab4b8b-scss _1edf52628d509e6baded2387f6267588-scss"
          )
        )
      )
      .then(() => {
        console.log("Found Login Button");
        driver
          .findElement(
            By.className(
              "_2221af4e93029bedeab751d04fab4b8b-scss _1edf52628d509e6baded2387f6267588-scss"
            )
          )
          .click();
      })
      .then(() => {
        console.log("Clicked Login Button");
        resolve();
      });
  });
};
const login = async (driver, user) => {
  //await driver.findElement(By.className("control-indicator")).click();
  await driver.wait(until.elementLocated(By.id("login-username")));
  for (let i = 0; i < user.name.length; i++) {
    await waitFor(randomTime(400, 100));
    await driver.findElement(By.id("login-username")).sendKeys(user.name[i]);
  }
  for (let i = 0; i < user.pass.length; i++) {
    await waitFor(randomTime(400, 100));
    await driver.findElement(By.id("login-password")).sendKeys(user.pass[i]);
  }
  await waitFor(randomTime(2000, 1000));
  await driver.findElement(By.id("login-button")).click();
  await waitFor(randomTime(2000, 1000));
  const error = await driver.findElements(By.className("alert-warning"));
  if (error.length > 0)
    throw new CustomError("Couldn't login, bad username/password", 404);
};

const getTime = () => {
  let log = new Date();
  return log.toUTCString();
};
const searchForSong = async driver => {
  await driver.wait(until.elementLocated(By.className("search-icon"))).click();
  const randomIndex = Math.floor(Math.random() * (data.songs.length - 1) + 1);
  const song = data.songs[randomIndex];
  console.log("Searching for song: " + song);
  for (let i = 0; i < song.length; i++) {
    await driver
      .wait(
        until.elementLocated(
          By.className("_2f8ed265fb69fb70c0c9afef329ae0b6-scss")
        )
      )
      .sendKeys(song[i]);
    await waitFor(randomTime(800, 400));
  }
  await driver
    .wait(
      until.elementLocated(
        By.className("_2f8ed265fb69fb70c0c9afef329ae0b6-scss")
      )
    )
    .sendKeys(Key.ENTER);
  return song;
};
const playSong = async driver => {
  try {
    await driver
      .wait(
        until.elementLocated(
          By.className("f79dd23c27c3352da3ac3ba62d78f8ea-scss")
        )
      )
      .click();
  } catch (e) {
    throw new CustomError("Couldn't select song", 400);
  }
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
  await waitFor(300000);
};
const letSongPlay = async driver => {
  const TIME_PLAYED = randomTime(9300, 5100);
  await waitFor(TIME_PLAYED);
  await driver
    .wait(
      until.elementLocated(
        By.className("_19813d13f17b9971773e54f5957ee593-scss")
      )
    )
    .click();
  return TIME_PLAYED;
};
const logout = async driver => {
  const actions = await driver.findElements(
    By.className("_5d8857b271ece35ed4dd191b5b15f48e-scss")
  );
  await waitFor(randomTime(3500, 500));
  const actionIndex = 2;
  actions.forEach((element, index) => {
    if (index === actionIndex) {
      element.click();
    }
  });
};

class CustomError extends Error {
  constructor(description, code, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    // Custom debugging information
    this.description = description;
    this.code = code;

    this.date = getTime();
  }
}
start();
