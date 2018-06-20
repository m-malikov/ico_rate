from bs4 import BeautifulSoup
import requests
import re


def get_ratings():
    ratings = {}
    for status in ["preico", "ongoing"]:
        n_pages = 40
        for i in range(1, n_pages):
            html_text = requests.get(
                "https://investfuture.ru/ico/rating?sort_field=rating&sort_type=asc&page={}&rating=15&cat=&filter_name=&date=&type={}".format(i, status)).text

            soup = BeautifulSoup(html_text, 'html.parser')

            for item in soup.select('table.table-hover tr'):
                cols = item.select('td')
                if len(cols) > 4:
                    name = cols[1].select('a')[0].text
                    name = re.sub(r" \([\w]*\)", "", name)

                    rating = float(cols[3].select('span')[0].text)
                    ratings[name] = rating

    return ratings
