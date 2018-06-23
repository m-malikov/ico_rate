from bs4 import BeautifulSoup
import requests

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://www.trackico.io"
    for address in ['presale/', 'ongoing/']:
        html_text = requests.get(base_url + "/" + address).text
        soup = BeautifulSoup(html_text, 'html.parser')
        n_pages = int(soup.select('a.page-link')[-2].text)
        for i in range(1, n_pages):
            html_text = requests.get(
                "{}/{}{}/".format(base_url, address, i)).text

            soup = BeautifulSoup(html_text, 'html.parser')

            for item in soup.select('div.card'):
                name_element = item.select('h5')
                rate_element = item.select('small')
                if name_element and rate_element:
                    name = name_element[0].text
                    verbose_rate = rate_element[-1].text
                    rate = None
                    try:
                        rate = float(verbose_rate) * 20
                    except:
                        continue
                    logo = base_url + item.select('img')[0]['src']
                    ico_page_link = base_url + item.select('a')[0]["href"]
                    ico_page = requests.get(ico_page_link).text
                    ico_soup = BeautifulSoup(ico_page, 'html.parser')
                    link = ico_soup.select('a.btn-success')[0]['href']
                    if name not in ratings:
                        ratings[name] = Ico(name)
                    ratings[name].add_rate(link, logo, None, None, address == "presale", Rate(
                        "Track ICO", verbose_rate, rate))
