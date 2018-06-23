from bs4 import BeautifulSoup
import requests

from ico import Ico, Rate


def add_rates(ratings):
    for show in ['ICO', 'PreICO']:
        html_text = requests.get(
            "https://icocrunch.io/?date=active&show=" + show).text
        soup = BeautifulSoup(html_text, 'html.parser')
        for item in soup.select('a.my-2'):
            name = item.select('span.fs16b')[0].text
            logo = item.select('img.wp-post-image')[0]['src']
            rate = item.select('p')[0].text
            ico_page_link = item["href"]
            ico_page = requests.get(ico_page_link).text
            ico_soup = BeautifulSoup(ico_page, "html.parser")
            link_element = ico_soup.find(
                'div', {"class": "icodadada"}).find_next_sibling('div')
            link = link_element['onclick'].split("('", 1)[1].split("')")[0]
            if name not in ratings:
                ratings[name] = Ico(name)
            ratings[name].add_rate(link, logo, None, None, show == "PreICO", Rate(
                "ICO Crunch", rate, float(rate) * 20))
