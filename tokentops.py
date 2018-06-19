from bs4 import BeautifulSoup
import requests
from pprint import pprint
import re
import cfscrape


def get_ratings():
    ratings = {}
    scraper = cfscrape.create_scraper()
    html_text = scraper.get(
        "https://tokentops.com/ico/ongoing/?sort=rank").content
    soup = BeautifulSoup(html_text, 'html.parser')
    for item in soup.select('div.upcoming-sec__main a.t_wrap'):
        name = item.select('b')[0].text
        rate = item.select('span.rating-text')[0].text
        ratings[name] = int(float(rate) * 20)
    return ratings


pprint(get_ratings())
