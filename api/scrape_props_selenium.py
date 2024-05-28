from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time


def get_top_projections():
    # Setup WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )

    url = "https://www.bettingpros.com/nba/picks/prop-bets/"
    driver.get(url)

    time.sleep(2)  # Wait for the page to load

    top_projections = []

    try:
        # Find elements using Selenium
        content_divs = driver.find_elements(
            By.CSS_SELECTOR, "div.grouped-items-with-sticky-footer__content"
        )
        for content in content_divs[:10]:  # Limit to top 10 items
            player = content.find_element(
                By.CSS_SELECTOR, "a.link.pbcs__player-link"
            ).text.strip()
            ftsy_score = content.find_element(
                By.CSS_SELECTOR, "div.flex.card__prop-container span.typography"
            ).text.strip()
            proj = (
                content.find_element(
                    By.CSS_SELECTOR, "div.flex.card__proj-container span.typography"
                )
                .text.strip()
                .replace("Proj ", "")
            )
            diff = (
                content.find_element(
                    By.CSS_SELECTOR,
                    "div.flex.card__proj-container span.typography:nth-child(2)",
                )
                .text.strip()
                .replace("Diff ", "")
            )
            recommendation = content.find_element(
                By.CSS_SELECTOR,
                "div.flex.card__proj-container span.projection__recommendation",
            ).text.strip()
            top_projections.append(
                {
                    "player": player,
                    "ftsy_score": ftsy_score,
                    "projection": proj,
                    "difference": diff,
                    "recommendation": recommendation,
                }
            )
    finally:
        driver.quit()

    return top_projections
