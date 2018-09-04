from bs4 import BeautifulSoup
import requests
import re

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://icorating.com/"
    for address in ["ico/presale/load", "ico/load"]:
        for i in range(1, 10):
            data = requests.get(base_url + address + "?page=" + str(i)).json()
            for item in data["icos"]["data"]:
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
                name = item["name"]
                if item["investment_rating_text"] is None:
                    continue
                if name not in ratings:
                    ratings[name] = Ico(name)
                ratings[name].add_rate(
                    item["link"],
                    base_url + item["logo"],
                    item["goal"] + "USD",
                    item["raised"] + "USD",
                    address == "ico/presale/load",
                    Rate("ICO Rating", item["investment_rating_text"],
                         grades[item["investment_rating_text"]])
                )
