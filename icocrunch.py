from bs4 import BeautifulSoup
import requests
from pprint import pprint


def get_ratings():
    ratings = {}
    for show in ['ICO', 'PreICO']:
        html_text = requests.get(
            "https://icocrunch.io/?date=active&show=" + show).text
        soup = BeautifulSoup(html_text, 'html.parser')
        for item in soup.select('a.my-2'):
            name = item.select('span.fs16b')[0].text
            rate = item.select('p')[0].text
            ratings[name] = int(float(rate) * 10)
    return ratings


print(get_ratings())
