from bs4 import BeautifulSoup
import requests
import re
import cfscrape

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://tokentops.com"
    scraper = cfscrape.create_scraper()
    html_text = scraper.get(base_url + "/ico/ongoing/?sort=rank").content
    soup = BeautifulSoup(html_text, 'html.parser')
    for item in soup.select('a.t_wrap'):
        name = item.select('b')[0].text
        rate = item.select('span.rating-text')[0].text
        logo = base_url + item.select('img')[0]["src"]
        ico_page_link = item["href"]
        ico_page = requests.get(ico_page_link).text
        ico_soup = BeautifulSoup(ico_page, "html.parser")
        link = None
        try:
            link = ico_soup.find("a", title="Website").get("href")
        except:
            continue
        if name not in ratings:
            ratings[name] = Ico(name)
        ratings[name].add_rate(link, logo, None, None, False, Rate(
            "Tokentops", rate, float(rate) * 20))
