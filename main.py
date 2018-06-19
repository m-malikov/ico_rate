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
            icos[name] = []
            print("  ", name)
        icos[name].append({"name": module.__name__, "value": value})

with open("ratings.json", "w") as f:
    f.write(json.dumps(icos))
