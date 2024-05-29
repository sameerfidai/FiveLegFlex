import React, { useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

const TopProjections = ({ projections }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleClick = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Top Projections | FiveLegFlex</title>
      </Head>
      <div className="text-white min-h-screen p-6 md:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-center text-5xl font-bold mb-8 text-gold">Top Prop Projections Today</h1>
          <div className="flex flex-col space-y-8">
            {projections.map((prop, index) => (
              <div
                key={index}
                className={`w-full border-2 ${
                  selectedIndices.includes(index) ? "bg-gold bg-opacity-30 shadow-2xl" : "border-white bg-fullblack shadow-xl"
                } rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center h-full transition-transform duration-300 ease-in-out cursor-pointer hover:bg-gold hover:bg-opacity-30 hover:scale-105`}
                onClick={() => handleClick(index)}
              >
                <div className="flex items-center space-x-4 sm:w-1/2 sm:mr-8 mb-4 sm:mb-0">
                  <img className="w-24 h-24 rounded-full border-4 border-gray" src={prop.img_url} alt={`Image of ${prop.player}`} />
                  <div>
                    <h2 className="text-3xl font-semibold text-white">{prop.player}</h2>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-1/2">
                  <div className="flex justify-between">
                    <span className="font-bold text-l text-gray">Projection:</span>
                    <span className="font-bold text-l text-white">{prop.projection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-l text-gray">Difference:</span>
                    <span className="font-bold text-l text-white">{prop.difference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-l text-gray">Line:</span>
                    <span className="font-bold text-gold text-xl">{prop.ftsy_score}</span>
                  </div>
                  <div className={`text-center font-bold py-2 px-4 rounded-lg shadow-md ${prop.recommendation.toLowerCase() === "over" ? "bg-green bg-opacity-80" : "bg-red bg-opacity-80"}`}>{prop.recommendation.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const options = new chrome.Options();
  options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
  let driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();

  let projections = [];

  try {
    await driver.get("https://www.bettingpros.com/nba/picks/prop-bets/");
    await driver.sleep(2000); // Wait for the page to load

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

  return { props: { projections } };
}

export default TopProjections;
