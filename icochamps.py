from bs4 import BeautifulSoup
import requests
from pprint import pprint
import re


def get_ratings():
    ratings = {}
    html_text = requests.get(
        "https://www.icochamps.com/rated-ico-list").text
    soup = BeautifulSoup(html_text, 'html.parser')
    for item in soup.select('div.ico-row'):
        name = item.select('span.ico_logo')[0].findNext('span').text.strip()
        name = re.sub(r" \([\w]*\)", "", name)
        name = re.sub(r" [0-9]\.[0-9]", "", name)
        name = re.sub(r" [0-9]", "", name)
        name = name.replace("\xa0", "")
        name = name.strip()

        rate = item.select('span.rating-nr')[0].text.strip()
        if rate != "N/A":
            ratings[name] = int(float(rate) * 10)
    return ratings


print(get_ratings())
