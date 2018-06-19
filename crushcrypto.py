from bs4 import BeautifulSoup
import requests
from pprint import pprint
import re
import cfscrape


def get_ratings():
    ratings = {}
    scraper = cfscrape.create_scraper()
    html_text = scraper.get(
        "https://crushcrypto.com/summary/").content
    soup = BeautifulSoup(html_text, 'html.parser')
    for item in soup.select('table.tablepress-id-1 tr'):
        if item.select('td.column-2'):
            name = item.select('td.column-2')[0].text
            rates = []
            rates.append(item.select('td.column-8')[0].text)
            rates.append(item.select('td.column-9')[0].text)

            rate = 0
            for r in rates:
                if r == 'Positive':
                    rate += 50
                elif r == 'Neutral':
                    rate += 30
                elif rate == 'Depends':
                    rate += 10

            ratings[name] = rate
    return ratings


pprint(get_ratings())
