$.get("http://localhost:8000/ratings.json", function(data) {
  results = [];
  for (var name in data) {
    if (data.hasOwnProperty(name)) {
      var nRates = data[name].length;
      if (nRates > 1) {
        var avgRate = 0;
        data[name].forEach(element => {
          avgRate += element.value;
        });
        avgRate /= nRates;
        results.push([name, Math.round(avgRate), nRates]);
      }
    }
  }

  results.sort(function(a, b) {
    return b[1] - a[1];
  });

  results.forEach(i => {
    var row = document.createElement("tr");
    i.forEach(j => {
      var cell = document.createElement("td");
      cell.innerText = j;
      row.appendChild(cell);
    });
    $("#main_table").append(row);
  });
});
