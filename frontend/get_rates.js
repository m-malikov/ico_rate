"use strict";

$(document).ready(function() {
  $.get("http://localhost:8000/ratings.json", function(data) {
    var results = [];
    for (var name in data) {
      if (data.hasOwnProperty(name)) {
        var nRates = data[name].length;
        if (nRates > 1) {
          var avgRate = 0;
          var tooltipText = "";
          data[name].forEach(element => {
            avgRate += element.value;
            tooltipText += `${element.name}: ${element.value}<br>`;
          });

          avgRate /= nRates;
          results.push({
            name: name,
            avgRate: Math.round(avgRate),
            nRates: nRates,
            tooltipText: tooltipText
          });
        }
      }
    }

    results.sort(function(a, b) {
      return b.avgRate - a.avgRate;
    });

    results.forEach(i => {
      var row = document.createElement("tr");

      var cell = document.createElement("td");
      cell.innerText = i.name;
      row.appendChild(cell);

      var cell = document.createElement("td");
      var span = document.createElement("span");
      var classList = ["badge", "badge-pill"];
      if (i.avgRate >= 90) {
        classList.push("badge-success");
      } else if (i.avgRate >= 75) {
        classList.push("badge-light");
      } else if (i.avgRate >= 50) {
        classList.push("badge-warning");
      } else {
        classList.push("badge-danger");
      }
      classList.forEach(c => {
        span.classList.add(c);
      });
      span.innerText = i.avgRate;
      cell.appendChild(span);
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = i.nRates;
      row.appendChild(cell);
      row.setAttribute("data-toggle", "tooltip");
      row.setAttribute("data-placement", "right");
      row.setAttribute("data-html", "true");
      row.setAttribute("title", i.tooltipText);
      $("#main_table").append(row);
    });

    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  });
});
