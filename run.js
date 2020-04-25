const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const data = require("./data");

// const timeout = () => new Promise(resolve => setTimeout(resolve, ms));
const waitFor = ms => new Promise(r => setTimeout(r, ms));
async function main(user) {
  const options = new chrome.Options();

  options.setUserPreferences({
    "profile.default_content_setting_values.notifications": 2
  });

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    await driver.get("https://open.spotify.com/browse/featured");
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

    await driver.wait(until.elementLocated(By.id("login-username")));
    await driver
      .findElement(By.id("login-username"))
      .sendKeys(user.name, Key.TAB, user.pass, Key.TAB, Key.ENTER);

    await driver
      .wait(until.elementLocated(By.className("search-icon")))
      .click();
    const randomSong = Math.floor(Math.random() * data.songs.length + 1);
    await driver
      .wait(
        until.elementLocated(
          By.className("_2f8ed265fb69fb70c0c9afef329ae0b6-scss")
        )
      )
      .sendKeys(data.songs[randomSong], Key.ENTER);
    await driver
      .wait(
        until.elementLocated(
          By.className("f79dd23c27c3352da3ac3ba62d78f8ea-scss")
        )
      )
      .click();
    await driver.wait(until.elementLocated(By.className("position-outer")));
    const songs = await driver.findElements(By.className("position-outer"));
    const songIndex = Math.floor(Math.random() * 5 + 1);
    songs.forEach((element, index) => {
      if (index === songIndex) {
        element.click();
        setTimeout(() => {
          element.click();
        }, 200);
        setTimeout(() => {
          element.click();
        }, 200);
        setTimeout(() => {
          element.click();
        }, 200);
      }
    });
    await waitFor(5000);
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
    const actionIndex = 2;
    actions.forEach((element, index) => {
      if (index === actionIndex) {
        element.click();
      }
    });
  } finally {
    console.log("1");
    await driver.quit();
    console.log("2");
    waitFor(1000);
    console.log("3");
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const start = async () => {
  await asyncForEach(data.users, async user => {
    console.log("0");

    await waitFor(1200);
    console.log(0.5);
    await main(user);
    console.log(4);
  });
  console.log("Done");
};

start();
// async function start() {
//   data.users.forEach(user => {
//       await main(user);
//       console.log(101)
//   });
// }

// start();
