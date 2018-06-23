import json


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
