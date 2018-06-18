from bs4 import BeautifulSoup
import requests
from pprint import pprint


def get_ratings():
    html_text = requests.get("https://icobench.com/icos").text
    soup = BeautifulSoup(html_text, 'html.parser')
    n_pages = soup.select('.pages a.num')[-2].text
    ratings = {}
    #change in prod
    for i in range(1, 5):
        html_text = requests.get(
            "https://icobench.com/icos?page={}".format(i)).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('div.ico_list tr'):
            name_element = item.select('a.name')
            rate_element = item.select('div.rate')
            if name_element:
                name = name_element[0].text
                suffix = " (PreICO)"
                if name.endswith(suffix):
                    name = name[:-len(suffix)]
                if name.startswith('\xa0'):
                    name = name[1:]
                rate = rate_element[0].text
                rate = int(float(rate)*20)
                ratings[name] = rate
    return ratings


print(get_ratings())
