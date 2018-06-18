from bs4 import BeautifulSoup
import requests
from pprint import pprint
import re


def get_ratings():
    n_pages = 500
    ratings = {}
    #change in prod
    for i in range(1, 5):
        html_text = requests.get(
            "https://investfuture.ru/ico/rating?sort_field=rating&sort_type=asc&page={}&rating=15&cat=&filter_name=&date=&type=ongoing".format(i)).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('table.table-hover tr'):
            cols = item.select('td')
            if len(cols) > 4:
                name = cols[1].select('a')[0].text
                name = re.sub(r" \([\w]*\)", "", name)

                rating = float(cols[3].select('span')[0].text)
                ratings[name] = rating

    return ratings


print(get_ratings())
