import json
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

icos = json.loads(open("ratings.json").read())

sources = [
    "ICO Bench",
    "ICO Rating",
    "InvestFuture",
    "ICO Bazaar",
    "Track ICO",
    "ICO Marks",
    "ICO Crunch",
    "ICO Champs",
    "CrushCrypto",
    "Tokentops"
]


def get_key(search_string, is_reverse=False):
    if search_string in ["name", "ras"]:
        return lambda x: x[search_string]
    elif search_string in ["goal", "raised"]:
        def handle_none(x):
            if x is None:
                return -1 if is_reverse else 10000000000
            else:
                return x
        return lambda x: handle_none(x[search_string] if search_string in x else None)
    elif search_string == "type":
        return lambda x: x["isPre"]
    elif search_string == "number of rates":
        return lambda x: len(x["rates"])
    elif search_string in map(lambda x: x.lower(), sources):
        def get_rate_number(x):
            for i in x["rates"]:
                if i["source"].lower() == search_string:
                    return i["number"]
            return -1 if is_reverse else 101
        return get_rate_number


for i in icos:
    total_score = 0
    n_rates = len(i["rates"])
    for r in i["rates"]:
        total_score += r["number"]
    avg_score = total_score / n_rates
    i["ras"] = int((avg_score * (1 + (n_rates - 4) * 0.09)) / 1.2)


icos = sorted(icos, key=get_key("ras", is_reverse=True), reverse=True)
for i in icos[:100]:
    i["isTop"] = True


def ico_fits_params(ico, params):
    if "isPre" in params and params["isPre"] != ico["isPre"]:
        return False
    if "minRates" in params and params["minRates"] > len(ico["rates"]):
        return False
    if "searchString" in params and params["searchString"].lower() not in ico["name"].lower():
        return False
    return True


@app.route('/api/', methods=["GET"])
@cross_origin()
def index():
    params = {}
    for key in ["minRates", "offset", "length"]:
        if key in request.args:
            params[key] = int(request.args[key])
    for key in ["sortBy", "searchString"]:
        if key in request.args:
            params[key] = request.args[key]
    for key in ["reverse", "isPre"]:
        if key in request.args:
            params[key] = request.args[key] == "true"
    print(params)

    filtered_icos = [i for i in icos if ico_fits_params(i, params)]
    sorted_icos = sorted(filtered_icos, key=get_key(
        params["sortBy"], params["reverse"]), reverse=params["reverse"])
    return jsonify(sorted_icos[params["offset"]:params["offset"] + params["length"]])


@app.route('/api/levels', methods=["GET"])
@cross_origin()
def levels():
    result = {}
    sortBy = sources + ["ras"]
    for s in sortBy:
        sorted_icos = sorted(icos, key=get_key(s.lower(), is_reverse=True))
        if s == "ras":
            result[s] = {"green": sorted_icos[-50]
                         [s], "yellow": sorted_icos[-10][s]}
        else:
            result[s] = {"green": 0, "yellow": 0}
            for i in sorted_icos[-50]["rates"]:
                if i["source"] == s:
                    result[s]["green"] = i["number"]
            for i in sorted_icos[-10]["rates"]:
                if i["source"] == s:
                    result[s]["yellow"] = i["number"]

    return jsonify(result)


@app.route('/api/by_names', methods=["GET"])
@cross_origin()
def by_names():
    names = request.args.getlist("name")
    result = []
    for name in names:
        for i in icos:
            if i["name"] == name:
                result.append(i)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=81)
