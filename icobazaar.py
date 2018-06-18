from bs4 import BeautifulSoup
import requests
from pprint import pprint


def get_ratings():
    html_text = requests.get(
        "https://icobazaar.com/v2/ico-list?order%5Brating%5D=desc&status%5B0%5D=ongoing").text
    soup = BeautifulSoup(html_text, 'html.parser')
    #n_pages = soup.select('a.js-fiter-page')[-1].text
    ratings = {}
    #change in prod
    for i in range(1, 5):
        html_text = requests.get(
            "https://icobazaar.com/v2/ico-list?order%5Brating%5D=desc&status%5B0%5D=ongoing&page={}".format(i)).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('div.ico'):
            name_element = item.select('h5')
            rate_element = item.select('div.ico-eva_class')
            if name_element:
                name = name_element[0].text
                suffix = " (Pre-ICO)"
                if name.endswith(suffix):
                    name = name[:-len(suffix)]
                rate = rate_element[0].text
                grades = {
                    "AAA": 100,
                    "AA": 90,
                    "A": 80,
                    "BBB": 70,
                    "BB": 60,
                    "B": 50,
                    "CCC": 40,
                    "CC": 30,
                    "C": 20,
                    "D": 0,
                    "TBD": 0,
                }
                ratings[name] = grades[rate]
    return ratings


pprint(get_ratings())
