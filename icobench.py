from bs4 import BeautifulSoup
import requests


def get_ratings():
    html_text = requests.get("https://icobench.com/icos?filterBonus=&filterBounty=&filterMvp=&filterTeam=&filterExpert=&filterSort=&filterCategory=all&filterRating=any&filterStatus=ongoing&filterPublished=&filterCountry=any&filterRegistration=0&filterExcludeArea=none&filterPlatform=any&filterCurrency=any&filterTrading=any&s=&filterStartAfter=&filterEndBefore=").text
    soup = BeautifulSoup(html_text, 'html.parser')
    n_pages = int(soup.select('a.num')[-1].text)
    ratings = {}
    for i in range(1, n_pages + 1):
        html_text = requests.get(
            "https://icobench.com/icos?page={}".format(i)).text

        soup = BeautifulSoup(html_text, 'html.parser')

        for item in soup.select('div.ico_list tr'):
            name_element = item.select('a.name')
            rate_element = item.select('div.rate')
            if name_element:
                name = name_element[0].text
                is_preico = False
                suffix = " (PreICO)"
                if name.endswith(suffix):
                    is_preico = True
                    name = name[:-len(suffix)]
                if name.startswith('\xa0'):
                    name = name[1:]
                rate = rate_element[0].text
                rate = int(float(rate)*20)
                link = 'https://icobench.com' + name_element[0]["href"]
                ratings[name] = {"rate": rate,
                                 "link": link, "is_preico": is_preico}
    return ratings
