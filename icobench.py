from bs4 import BeautifulSoup
import requests

from ico import Ico, Rate


def add_rates(ratings):
    base_url = "https://icobench.com"
    html_text = requests.get(base_url + "/icos?filterBonus=&filterBounty=&filterMvp=&filterTeam=&filterExpert=&filterSort=&filterCategory=all&filterRating=any&filterStatus=ongoing&filterPublished=&filterCountry=any&filterRegistration=0&filterExcludeArea=none&filterPlatform=any&filterCurrency=any&filterTrading=any&s=&filterStartAfter=&filterEndBefore=").text
    soup = BeautifulSoup(html_text, 'html.parser')
    n_pages = int(soup.select('a.num')[-1].text)
    for i in range(1, n_pages + 1):
        html_text = requests.get(
            "{}/icos?page={}".format(base_url, i)).text

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
                logo_element = item.select('a.image')[0]
                logo = base_url + \
                    logo_element['style'].split("('", 1)[1].split("')")[0]
                ico_page_link = base_url + name_element[0]["href"]
                ico_page = requests.get(ico_page_link).text
                ico_soup = BeautifulSoup(ico_page, "html.parser")
                link = ico_soup.select('a.button_big')[0]['href']
                if name not in ratings:
                    ratings[name] = Ico(name)
                ratings[name].add_rate(link, logo, None, None, is_preico, Rate(
                    "ICO bench", rate, int(float(rate)*20)))
