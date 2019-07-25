const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const xpathFB = '//*[@id="app"]/body/div[1]/div[2]/div/div[2]/div/a';

(async function example() {
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
				By.className("_560148ed21412c8262390910d3441f33.scss")
			)
		);
		await driver
			.findElement(By.className("_560148ed21412c8262390910d3441f33.scss"))
			.click();

		await driver.wait(until.elementLocated(By.xpath(xpathFB)));
		await driver.findElement(By.xpath(xpathFB)).click();

		await driver.wait(until.elementLocated(By.id("email")));
		await driver
			.findElement(By.id("email"))
			.sendKeys(email, Key.TAB, pass, Key.TAB, Key.ENTER);

		await driver.wait(until.elementLocated(By.className("_51_n")));
		await driver.findElement(By.className("_51_n")).click();

		// await driver.wait(until.elementLocated(By.className("spoticon-play-16")));
		// await driver.findElement(By.className("spoticon-play-16")).click();

		//search-icon
		await driver.wait(until.elementLocated(By.className("search-icon")));
		await driver.findElement(By.className("search-icon")).click();
		// SearchInputBox__input
		await driver.wait(
			until.elementLocated(By.className("SearchInputBox__input"))
		);
		await driver
			.findElement(By.className("SearchInputBox__input"))
			.sendKeys("Billie eilish bad guy");
		// spoticon-track-16
		await driver.wait(until.elementLocated(By.className("spoticon-track-16")));
		await driver.findElement(By.className("spoticon-track-16")).click();
	} finally {
		const options = new chrome.Options();

		options.setUserPreferences({
			"profile.default_content_setting_values.notifications": 2
		});

		let newDriver = await new Builder()
			.forBrowser("chrome")
			.setChromeOptions(options)
			.build();

		await newDriver.get("https://open.spotify.com/browse/featured");
		await newDriver.wait(
			until.elementLocated(
				By.className("_560148ed21412c8262390910d3441f33.scss")
			)
		);
		await newDriver
			.findElement(By.className("_560148ed21412c8262390910d3441f33.scss"))
			.click();

		await newDriver.wait(until.elementLocated(By.id("login-username")));
		await newDriver
			.findElement(By.id("login-username"))
			.sendKeys(normalEmail, Key.TAB, normalPass, Key.TAB, Key.TAB, Key.ENTER);

		//search-icon
		await newDriver.wait(until.elementLocated(By.className("search-icon")));
		await newDriver.findElement(By.className("search-icon")).click();
		// SearchInputBox__input
		await newDriver.wait(
			until.elementLocated(By.className("SearchInputBox__input"))
		);
		await newDriver
			.findElement(By.className("SearchInputBox__input"))
			.sendKeys("Billie eilish bad guy");
		// spoticon-track-16
		await newDriver.wait(
			until.elementLocated(By.className("spoticon-track-16"))
		);
		await newDriver.findElement(By.className("spoticon-track-16")).click();
		// //await driver.quit();
	}
})();
