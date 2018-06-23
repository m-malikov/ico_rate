from bs4 import BeautifulSoup
import requests
import re

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://icorating.com/"
    for address in ["ico", "ico/preico"]:
        html_text = requests.get(base_url + address).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('table')[1].select('tr'):
            cols = item.select('td')
            if len(cols) > 5:
                name = cols[1].text.strip()
                rate = cols[5].text.strip()
                name = re.sub(r" \([\w]*\)", "", name)
                logo = base_url + item.select('img')[0]['src']

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
                raised = None
                raised_element = cols[6].select('span.blac-blue-collected')
                if raised_element:
                    raised = raised_element[0].text.strip()

                goal = None
                goal_element = cols[7].select('span.blac-blue-collected')
                if goal_element:
                    goal = goal_element[0].text.strip()
                ico_page_link = item["data-href"]
                ico_page = requests.get(ico_page_link).text
                ico_soup = BeautifulSoup(ico_page, "html.parser")
                link = ico_soup.find(
                    'span', text=" Website").parent.get('href')
                if name not in ratings:
                    ratings[name] = Ico(name)
                ratings[name].add_rate(
                    link, logo, goal, raised, address == "ico/preico", Rate("ICO Rating", rate, grades[rate]))
