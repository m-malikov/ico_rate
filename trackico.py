from bs4 import BeautifulSoup
import requests


def get_ratings():
    ratings = {}
    for address in ['presale/', 'ongoing/']:
        html_text = requests.get(
            "https://www.trackico.io/" + address).text
        soup = BeautifulSoup(html_text, 'html.parser')
        n_pages = int(soup.select('a.page-link')[-2].text)
        for i in range(1, n_pages):
            html_text = requests.get(
                "https://www.trackico.io/{}{}/".format(address, i)).text

            soup = BeautifulSoup(html_text, 'html.parser')

            for item in soup.select('div.card'):
                name_element = item.select('h5')
                rate_element = item.select('small')
                if name_element and rate_element:
                    name = name_element[0].text
                    rate = rate_element[-1].text
                    try:
                        ratings[name] = int(20*float(rate))
                    except:
                        pass
    return ratings
