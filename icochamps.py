from bs4 import BeautifulSoup
import requests
import re

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://www.icochamps.com"
    for address in ["ongoing", "pre-ico"]:
        html_text = requests.get(
            base_url + "/ico/" + address).text
        soup = BeautifulSoup(html_text, 'html.parser')
        for item in soup.select('div.ico-row'):
            name = item.select('span.ico_logo')[
                0].findNext('span').text.strip()
            name = re.sub(r" \([\w]*\)", "", name)
            name = re.sub(r" [0-9]\.[0-9]", "", name)
            name = re.sub(r" [0-9]", "", name)
            name = name.replace("\xa0", "")
            name = name.strip()

            rate = item.select('span.rating-nr')[0].text.strip()
            logo = base_url + item.select('img.ico-logo-small')[0]['src']
            ico_page_link = item.select('a')[0]['href']
            ico_page = requests.get(ico_page_link).text
            ico_soup = BeautifulSoup(ico_page, "html.parser")
            link = None
            try:
                link = ico_soup.select('a.website')[0]['href']
            except:
                pass
            if rate != "N/A":
                if not name in ratings:
                    ratings[name] = Ico(name)
                for i in ratings[name].rates:
                    if i.source == name:
                        continue
                ratings[name].add_rate(link, logo, None, None, address ==
                                       "pre-ico", Rate("ICO Champs", rate, int(float(rate)*20)))
