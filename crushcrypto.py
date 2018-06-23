from bs4 import BeautifulSoup
import requests
import re
import cfscrape

from ico import Ico, Rate


def add_rates(ratings):
    scraper = cfscrape.create_scraper()
    html_text = scraper.get(
        "https://crushcrypto.com/summary/").content
    soup = BeautifulSoup(html_text, 'html.parser')
    for item in soup.select('table.tablepress-id-1 tr'):
        if item.select('td.column-2'):
            name = item.select('td.column-2')[0].text
            link = next(item.select(
                'td.column-7')[0].children)['href']
            rates = []
            rates.append(item.select('td.column-8')[0].text)
            rates.append(item.select('td.column-9')[0].text)

            verbose_rate = "Short term: {}, Long term: {}".format(
                rates[0], rates[1])
            rate = 0
            for r in rates:
                if r == 'Positive':
                    rate += 50
                elif r == 'Neutral':
                    rate += 30
                elif rate == 'Depends':
                    rate += 10

            if not name in ratings:
                ratings[name] = Ico(name)
            ratings[name].add_rate(link, None, None, None, None, Rate(
                "CrushCrypto", verbose_rate, rate))
