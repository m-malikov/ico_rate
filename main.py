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

modules = [
    crushcrypto,
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
    module.add_rates(icos)

json_data = json.dumps([icos[name].to_dict() for name in icos])
print(json_data)
with open("frontend/ratings.json", "w") as f:
    f.write(json_data)
