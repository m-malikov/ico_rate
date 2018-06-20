import crushcrypto
import icobazaar
import icobench
import icochamps
import icocrunch
import icomarks
import icorating
import investfuture
import tokentops
import trackico

from pprint import pprint
import json

modules = [crushcrypto,
           icobazaar,
           icobench,
           icochamps,
           icocrunch,
           icomarks,
           icorating,
           investfuture,
           tokentops,
           trackico]

icos = {}
for module in modules:
    print(module.__name__)
    ratings = module.get_ratings()
    for name, value in ratings.items():
        if not name in icos:
            icos[name] = {"link": value["link"],
                          "is_preico": value["is_preico"], "rates": []}
            print("  ", name)
        icos[name]["rates"].append(
            {"name": module.__name__, "value": value["rate"]})

with open("ratings.json", "w") as f:
    f.write(json.dumps(icos))
