"use strict";

$(document).ready(function() {
  $.get("http://localhost:8000/ratings.json", function(data) {
    var results = [];
    for (var name in data) {
      if (data.hasOwnProperty(name)) {
        var nRates = data[name].rates.length;
        var avgRate = 0;
        var tooltipText = "";
        data[name].rates.forEach(element => {
          avgRate += element.value;
          tooltipText += `${element.name}: ${element.value}<br>`;
        });

        avgRate /= nRates;
        results.push({
          name: name,
          avgRate: Math.round(avgRate),
          nRates: nRates,
          tooltipText: tooltipText,
          link: data[name].link,
          is_preico: data[name].is_preico
        });
      }
    }

    results.sort(function(a, b) {
      return b.avgRate - a.avgRate;
    });

    function show() {
      $("tr.ico").remove();

      var minRates = $("#minRates").val();
      var type = $("input:radio:checked").val();

      results.forEach(i => {
        if (
          i.nRates >= minRates &&
          (type == "all" ||
            (type == "ico" && i.is_preico == false) ||
            (type == "preIco" && i.is_preico == true))
        ) {
          var row = document.createElement("tr");

          var cell = document.createElement("td");
          var link = document.createElement("a");
          link.innerText = i.name;
          link.href = i.link;
          cell.appendChild(link);
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

          var cell = document.createElement("td");
          cell.innerText = i.is_preico ? "Pre-ICO" : "ICO";
          row.appendChild(cell);

          row.setAttribute("data-toggle", "tooltip");
          row.setAttribute("data-placement", "right");
          row.setAttribute("data-html", "true");
          row.setAttribute("title", i.tooltipText);
          row.classList.add("ico");
          $("#main_table").append(row);
        }
      });

      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });
    }

    show();
    $("#minRates").change(show);
    $(".form-check").change(show);
  });
});
