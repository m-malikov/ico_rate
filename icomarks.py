from bs4 import BeautifulSoup
import requests

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://icomarks.com"
    for status in ['presale_active', 'active']:
        for offset in range(0, 60, 20):
            html_text = requests.post(
                base_url + "/icos/ajax_more", data={"offset": offset, "status": status}).json()["content"]
            soup = BeautifulSoup(html_text, 'html.parser')
            for item in soup.select('div.icoListItem'):
                name = item.select('a.icoListItem__title')[0].text
                logo = base_url + item.select('img')[0]["src"]
                ico_page_link = base_url + \
                    item.select('a.icoListItem__title')[0]["href"]
                ico_page = requests.get(ico_page_link).text
                ico_soup = BeautifulSoup(ico_page, "html.parser")
                link = None
                try:
                    link = ico_soup.select('a.visitSite')[0]['href']
                except:
                    continue
                rate = item.select('div.icoListItem__rate')[0].text.strip()
                if name not in ratings:
                    ratings[name] = Ico(name)
                ratings[name].add_rate(link, logo, None, None, status == 'presale_active', Rate(
                    "ICO Marks", rate, float(rate) * 10))
