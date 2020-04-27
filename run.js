const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const data = require("./data");
const fs = require("fs");

const randomTime = (max, min) => Math.floor(Math.random() * max + min);
const waitFor = ms => new Promise(r => setTimeout(r, ms));

const logToFile = (artist, timeListened, song, user, login, logout) => {
  let info = {
    user: user,
    login_time: login,
    artist_played: artist,
    song_played: song,
    playing_time: timeListened,
    logout_time: logout
  };
  const string = JSON.stringify(info);
  let data = `${string}\n`;
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
  let SONG_NAME;
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

    //! This is for going to url
    const albumToPlay = getRandomAlbum();
    await openAlbum(driver, albumToPlay);
    console.log("Opened Album Page");
    await waitFor(randomTime(2000, 1000));
    await playAlbum(driver);
    console.log("Started Playing Album");
    await waitFor(randomTime(2000, 1000));

    await ensureShuffleOn(driver);
    console.log("Turned Shuffle On");
    await waitFor(randomTime(2000, 1000));

    await goToNextTrack(driver);
    console.log("Started Next Track");
    await waitFor(randomTime(65000, 55000));
    TIME_PLAYED = await getTotalTimePlayed(driver);
    console.log("TIME_PLAYED", TIME_PLAYED);
    SONG_NAME = await getSongName(driver);
    console.log("SONG_NAME", SONG_NAME);
    ARTIST = await getArtist(driver);
    console.log("ARTIST", ARTIST);

    //!Log out stuff
    await logout(driver);
    LOGOUT_TIME = getTime();
    console.log("Logged out @ " + LOGOUT_TIME);
    await waitFor(randomTime(5500, 3500));

    await logToFile(
      ARTIST,
      TIME_PLAYED,
      SONG_NAME,
      user.name,
      LOGIN_TIME,
      LOGOUT_TIME
    );
    console.log("Written to log");
  } catch (e) {
    console.log("Error!!");
    console.log(e.code);
    console.log(e.description);
    console.log(e.date);
    await logError(user, e);
  } finally {
    await driver.quit();
    console.log("Browser Closed");
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
  console.log("FINISHED ONE ROUND");
  start();
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
const openAlbum = (driver, album) => {
  return new Promise(resolve => {
    driver.get(album.url).then(resolve());
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
  await waitFor(randomTime(1000, 500));
  await driver.findElement(By.className("control-indicator")).click();
  await waitFor(randomTime(1000, 500));
  await driver.wait(until.elementLocated(By.id("login-username")));
  for (let i = 0; i < user.name.length; i++) {
    await waitFor(randomTime(300, 100));
    await driver.findElement(By.id("login-username")).sendKeys(user.name[i]);
  }
  await waitFor(randomTime(300, 100));
  for (let i = 0; i < user.pass.length; i++) {
    await waitFor(randomTime(300, 100));
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
const getRandomAlbum = () => {
  const totalAlbums = data.albums.length;
  const randomIndex = randomTime(totalAlbums, 0);
  return data.albums[randomIndex];
};
const logout = async driver => {
  const profilePath =
    "/html/body/div[3]/div/div[3]/div[1]/header/div[4]/button";
  const actions = await driver.findElements(By.xpath(profilePath));
  await waitFor(randomTime(3500, 2000));
  const actionIndex = 2;
  actions.forEach((element, index) => {
    if (index === actionIndex) {
      element.click();
    }
  });
};

const getTotalTimePlayed = driver => {
  const path =
    "/html/body/div[3]/div/div[3]/div[3]/footer/div/div[2]/div/div[2]/div[1]";
  return new Promise(resolve => {
    driver.findElements(By.xpath(path)).then(elements => {
      elements[0].getText().then(time => resolve(time));
    });
  });
};
const getSongName = driver => {
  const path =
    "/html/body/div[3]/div/div[3]/div[3]/footer/div/div[1]/div/div[2]/div[1]/div/span/a";
  return new Promise(resolve => {
    driver.findElements(By.xpath(path)).then(elements => {
      elements[0].getText().then(name => resolve(name));
    });
  });
};
const getArtist = driver => {
  const path =
    "/html/body/div[3]/div/div[3]/div[3]/footer/div/div[1]/div/div[2]/div[2]/span/span/span/a";
  return new Promise(resolve => {
    driver.findElements(By.xpath(path)).then(elements => {
      elements[0].getText().then(name => resolve(name));
    });
  });
};

const playAlbum = driver => {
  // const playClass = "_11f5fc88e3dec7bfec55f7f49d581d78-scss";
  // return new Promise(resolve => {
  //   driver.wait(until.elementLocated(By.className(playClass))).then(() => {
  //     driver
  //       .findElements(By.className(playClass))
  //       .then(elements => {
  //         elements[1].click();
  //       })
  //       .then(() => resolve());
  //   });
  // });
  return new Promise(resolve => {
    driver
      .wait(
        until.elementLocated(
          By.xpath(
            "/html/body/div[3]/div/div[3]/div[4]/div[1]/div/div[2]/section[1]/div[3]/div/button[1]"
          )
        )
      )
      .then(() => {
        driver
          .findElement(
            By.xpath(
              "/html/body/div[3]/div/div[3]/div[4]/div[1]/div/div[2]/section[1]/div[3]/div/button[1]"
            )
          )
          .click();
      })
      .then(() => resolve());
  });
};
const ensureShuffleOn = driver => {
  const classNoShuffle = "control-button spoticon-shuffle-16";
  const classShuffle =
    "control-button spoticon-shuffle-16 control-button--active";
  return new Promise(resolve => {
    driver.findElements(By.className(classShuffle)).then(elements => {
      if (elements.length === 0) {
        driver.findElement(By.className(classNoShuffle)).then(element => {
          element.click();
          resolve();
        });
      }
    });
  });
};
const goToNextTrack = driver => {
  const nextTrackPath =
    "/html/body/div[3]/div/div[3]/div[3]/footer/div/div[2]/div/div[1]/div[4]/button";
  return new Promise(resolve => {
    driver.findElement(By.xpath(nextTrackPath)).then(element => {
      element.click();
      resolve();
    });
  });
};
class CustomError extends Error {
  constructor(description, code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.description = description;
    this.code = code;
    this.date = getTime();
  }
}
start();
