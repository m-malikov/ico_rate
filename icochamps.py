from bs4 import BeautifulSoup
import requests
import re


def get_ratings():
    ratings = {}
    for address in ["ongoing", "pre-ico"]:
        html_text = requests.get(
            "https://www.icochamps.com/ico/" + address).text
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
            is_preico = address == "pre-ico"
            link = item.select('a')[0]['href']
            print(link)
            if rate != "N/A":
                ratings[name] = {"rate": int(
                    float(rate) * 10), "link": link, "is_preico": is_preico}
    return ratings
