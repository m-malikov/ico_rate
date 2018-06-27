import json
import re


class Rate:
    def __init__(self, source, verbose, number):
        self.source = source
        self.verbose = verbose
        self.number = number


class Ico:
    def __init__(self, name):
        self.name = name
        self.link = None
        self.logo = None
        self.goal = None
        self.raised = None
        self.isPre = None
        self.rates = []

    def add_rate(self, link, logo, goal, raised, isPre, rate):
        usd_to_btc = 1 / 6082
        eur_to_btc = 1 / 5310
        eth_to_btc = 0.0711
        if goal is not None:
            print(goal)
            if goal.count('.') > 1:
                goal = re.sub(r"\.", "", goal)
            if goal.count(',') > 0:
                goal = re.sub(r",", "", goal)
            goal = re.sub(r" ", "", goal)
            print(goal)
            if goal.endswith("USD"):
                goal = float(goal[:-3]) * usd_to_btc
            elif goal.endswith("EUR"):
                goal = float(goal[:-3]) * eur_to_btc
            elif goal.endswith("ETH"):
                goal = float(goal[:-3]) * eth_to_btc
            elif goal.endswith("BTC"):
                goal = float(goal[:-3])
            elif goal.startswith("$"):
                goal = float(goal[1:]) * usd_to_btc
            elif goal.startswith("ETH"):
                goal = float(goal[3:]) * eth_to_btc
            print(goal)
        if raised is not None:
            if raised.count('.') > 1:
                raised = re.sub(r"\.", "", raised)
            if raised.count(',') > 0:
                raised = re.sub(r",", "", raised)
            raised = re.sub(r" ", "", raised)
            print(raised)
            if raised.endswith("USD"):
                raised = float(raised[:-3]) * usd_to_btc
            elif raised.endswith("EUR"):
                raised = float(raised[:-3]) * eur_to_btc
            elif raised.endswith("ETH"):
                raised = float(raised[:-3]) * eth_to_btc
            elif raised.endswith("BTC"):
                raised = float(raised[:-3])
            elif raised.startswith("$"):
                raised = float(raised[1:]) * usd_to_btc
            elif raised.startswith("ETH"):
                raised = float(raised[3:]) * eth_to_btc
            print(raised)

        for i in self.rates:
            if i.source == rate.source:
                return
        if self.link is None:
            self.link = link
        if self.logo is None:
            self.logo = logo
        if self.goal is None:
            self.goal = goal
        if self.raised is None:
            self.raised = raised
        if self.isPre is None:
            self.isPre = isPre
        self.rates.append(rate)

    def to_dict(self):
        attr_dict = self.__dict__
        attr_dict["rates"] = [i.__dict__ for i in self.rates]
        return attr_dict
