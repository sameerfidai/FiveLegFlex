import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import chromedriver from "chromedriver";

export default async function handler(req, res) {
  const options = new chrome.Options();
  options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
  let driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();

  let projections = [];

  try {
    await driver.get("https://www.bettingpros.com/nba/picks/prop-bets/");
    await driver.sleep(3000); // Wait for the page to load

    let contentDivs = await driver.findElements(By.css("div.grouped-items-with-sticky-footer__content"));
    for (let i = 0; i < Math.min(contentDivs.length, 10); i++) {
      let content = contentDivs[i];
      let player = await content.findElement(By.css("a.link.pbcs__player-link")).getText();
      let ftsy_score = await content.findElement(By.css("div.flex.card__prop-container span.typography")).getText();
      let proj = await content.findElement(By.css("div.flex.card__proj-container span.typography")).getText();
      let diff = await content.findElement(By.css("div.flex.card__proj-container span.typography:nth-child(2)")).getText();
      let recommendation = await content.findElement(By.css("div.flex.card__proj-container span.projection__recommendation")).getText();
      let img_url = await content.findElement(By.css("img.player-image-card__player-image")).getAttribute("src");

      projections.push({
        player: player.trim(),
        ftsy_score: ftsy_score.trim(),
        projection: proj.trim().replace("Proj ", ""),
        difference: diff.trim().replace("Diff ", ""),
        recommendation: recommendation.trim(),
        img_url: img_url.trim(),
      });
    }
  } catch (error) {
    console.error("Error fetching projections:", error);
  } finally {
    await driver.quit();
  }

  res.status(200).json(projections);
}
