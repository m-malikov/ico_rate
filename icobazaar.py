from bs4 import BeautifulSoup
import requests

from ico import Ico, Rate


def add_rates(ratings):
    html_text = requests.get(
        "https://icobazaar.com/v2/ico-list?order%5Brating%5D=desc&status%5B0%5D=ongoing").text
    soup = BeautifulSoup(html_text, 'html.parser')
    n_pages = int(soup.select('a.js-filter-page')[-2].text)
    print(n_pages)
    for i in range(1, n_pages + 1):
        print(i)
        html_text = requests.get(
            "https://icobazaar.com/v2/ico-list?order%5Brating%5D=desc&status%5B0%5D=ongoing&page={}".format(i)).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('div.ico'):
            name_element = item.select('h5')
            rate_element = item.select('div.ico-eva_class')
            if name_element:
                name = name_element[0].text
                is_preico = False
                suffix = " (Pre-ICO)"
                if name.endswith(suffix):
                    name = name[:-len(suffix)]
                    is_preico = True
                rate = rate_element[0].text
                if rate == "TBD":
                    break
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
                }
                logo = item.select('img')[0]['src']
                ico_page_link = item.select("a.ico-link")[0]['href']
                ico_page = requests.get(ico_page_link).text
                ico_soup = BeautifulSoup(ico_page, "html.parser")
                link = None
                try:
                    link = ico_soup.select('a.btn-dark')[0]["href"]
                except:
                    pass
                goal = None
                try:
                    goal = ico_soup.find('span', text="Goal:").findNext(
                        "span").contents[0]
                except:
                    pass
                if name not in ratings:
                    ratings[name] = Ico(name)
                ratings[name].add_rate(link, logo, goal, None, is_preico, Rate(
                    "ICO Bazaar", rate, grades[rate]))
