"use strict";

$(document).ready(function() {
  $.get("http://localhost:8000/ratings.json", function(data) {
    data.forEach(ico => {
      ico.avgRate = 0;
      ico.nRates = ico.rates.length;
      ico.tooltipText = "";
      ico.rates.forEach(rate => {
        ico.avgRate += rate.number;
        ico.tooltipText += `<strong>${rate.source}</strong>: ${
          rate.verbose
        }<br>`;
      });
      ico.avgRate = Math.round(ico.avgRate / ico.nRates);
    });

    data.sort(function(a, b) {
      return b.avgRate - a.avgRate;
    });

    function show() {
      $("tr.ico").remove();

      var minRates = $(".nrates.active").text();
      var type = $(".status.active").text();
      console.log(minRates, type);

      data.forEach(i => {
        if (
          i.nRates >= minRates &&
          (type == "All" ||
            (type == "ICO" && !i.isPre) ||
            (type == "Pre-ICO" && i.isPre))
        ) {
          var row = document.createElement("tr");

          var cell = document.createElement("td");
          var link = document.createElement("a");
          link.href = i.link;
          if (i.logo) {
            var img = document.createElement("img");
            img.setAttribute("src", i.logo);
            img.classList.add("ico-logo");
            link.appendChild(img);
          }
          cell.appendChild(link);
          row.appendChild(cell);

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
          cell.innerText = i.isPre ? "Pre-ICO" : "ICO";
          row.appendChild(cell);

          var cell = document.createElement("td");
          cell.innerText = i.goal;
          row.appendChild(cell);

          var cell = document.createElement("td");
          cell.innerText = i.raised;
          row.appendChild(cell);

          row.setAttribute("data-toggle", "tooltip");
          row.setAttribute("data-placement", "right");
          row.setAttribute("data-html", "true");
          row.setAttribute("title", i.tooltipText);
          row.classList.add("ico");
          $("#main_table").append(row);
        }
      });
      $('[data-toggle="tooltip"]').tooltip();
    }

    $("div.btn-group button").click(function(evt) {
      $(this)
        .parent()
        .children()
        .removeClass("active");
      $(this).addClass("active");
      $(".controls").hide();
      show();
      $(".controls").show();
    });
    show();
  });
});
