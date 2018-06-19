from bs4 import BeautifulSoup
import requests


def get_ratings():
    ratings = {}
    for status in ['presale_active', 'active']:
        for offset in range(0, 200, 20):
            html_text = requests.post(
                "https://icomarks.com/icos/ajax_more", data={"offset": offset, "status": status}).json()["content"]
            soup = BeautifulSoup(html_text, 'html.parser')
            for item in soup.select('div.icoListItem'):
                name = item.select('a.icoListItem__title')[0].text
                rate = item.select('div.icoListItem__rate')[0].text.strip()
                ratings[name] = int(float(rate) * 10)
    return ratings
