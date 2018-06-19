from bs4 import BeautifulSoup
import requests
import re


def get_ratings():
    ratings = {}
    for address in ["/ico", "/ico/preico"]:
        html_text = requests.get("https://icorating.com" + address).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('table')[1].select('tr'):
            cols = item.select('td')
            if len(cols) > 5:
                name = cols[1].text.strip()
                rate = cols[5].text.strip()
                name = re.sub(r" \([\w]*\)", "", name)
                grades = {
                    "Positive+": 100,
                    "Positive": 90,
                    "Stable+": 80,
                    "Stable": 70,
                    "Risky+": 60,
                    "Risky": 50,
                    "Risky-": 40,
                    "Negative": 30,
                    "Negative-": 20,
                    "Default": 10,
                }
                rate = grades[rate]
                ratings[name] = rate
    return ratings
