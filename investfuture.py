from bs4 import BeautifulSoup
import requests
import re

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://investfuture.ru"
    for status in ["preico", "ongoing"]:
        n_pages = 40
        for i in range(1, n_pages):
            html_text = requests.get(
                base_url + "/ico/rating?sort_field=rating&sort_type=asc&page={}&rating=15&cat=&filter_name=&date=&type={}".format(i, status)).text

            soup = BeautifulSoup(html_text, 'html.parser')

            for item in soup.select('table.table-hover tr'):
                cols = item.select('td')
                if len(cols) > 4:
                    name = cols[1].select('a')[0].text
                    name = re.sub(r" \([\w]*\)", "", name)
                    logo = item.select('img')[0]['src']
                    goal = cols[4].text
                    ico_page_link = "https://investfuture.ru" + \
                        cols[1].select('a')[0]["href"]
                    ico_page_link = ico_page_link.replace("/rating", "")
                    ico_page = requests.get(ico_page_link).text
                    ico_soup = BeautifulSoup(ico_page, "html.parser")
                    link = None
                    try:
                        link = ico_soup.find(
                            'span', {"data-target": "#ico_red"}).text
                    except:
                        pass

                    rate = cols[3].select('span')[0].text
                    if name not in ratings:
                        ratings[name] = Ico(name)
                    else:
                        continue
                    ratings[name].add_rate(link, logo, goal, None, status == "preico", Rate(
                        "InvestFuture", rate, float(rate)))
