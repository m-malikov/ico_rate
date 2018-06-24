"use strict";

$(document).ready(function() {
  $.get("ratings.json", function(data) {
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
      ico.avgRate = Math.round(
        (ico.avgRate * (1 + (ico.nRates - 3) * 0.05)) / 1.2
      );
    });

    data.sort(function(a, b) {
      return b.avgRate - a.avgRate;
    });

    var sources = [
      "CrushCrypto",
      "ICO Bazaar",
      "ICO Bench",
      "ICO Champs",
      "ICO Crunch",
      "ICO Marks",
      "ICO Rating",
      "InvestFuture",
      "Tokentops",
      "Track ICO"
    ];

    sources.forEach(source => {
      var th = document.createElement("th");
      th.innerText = source;
      $("#detailed_header").append(th);
    });

    function updateTables() {
      $("tr.ico").remove();

      var minRates = $(".nrates.active").text();
      var type = $(".status.active").text();

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
          var h = document.createElement("h5");
          var span = document.createElement("span");
          var classList = ["badge"];
          if (i.avgRate >= 90) {
            classList.push("badge-success");
          } else if (i.avgRate >= 60) {
            classList.push("badge-light");
          } else if (i.avgRate >= 40) {
            classList.push("badge-warning");
          } else {
            classList.push("badge-danger");
          }
          classList.forEach(c => {
            span.classList.add(c);
          });
          span.innerText = i.avgRate;
          h.appendChild(span);
          cell.appendChild(h);
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
          row.classList.add("ico");

          sources.forEach(source => {
            var td = document.createElement("td");
            i.rates.forEach(rate => {
              if (rate.source == source) {
                var h = document.createElement("h5");
                var span = document.createElement("span");
                var classList = ["badge"];
                if (rate.number >= 90) {
                  classList.push("badge-success");
                } else if (rate.number >= 60) {
                  classList.push("badge-light");
                } else if (rate.number >= 40) {
                  classList.push("badge-warning");
                } else {
                  classList.push("badge-danger");
                }
                classList.forEach(c => {
                  span.classList.add(c);
                });
                span.innerText = rate.verbose.trim().replace(",", "\n");
                td.innerHTML = "";
                h.appendChild(span);
                td.appendChild(h);
              }
            });
            row.appendChild(td);
          });

          $("#detailed_table").append(row);
        }
      });
      $('[data-toggle="tooltip"]').tooltip();
    }

    $("div.btn-group button").click(function() {
      $(this)
        .parent()
        .children()
        .removeClass("active");
      $(this).addClass("active");
    });

    $("button.status, button.nrates").click(function() {
      updateTables();
    });

    $("#detailed_table").hide();
    $("button.detailed").click(function() {
      if ($(".detailed.active").text() == "On") {
        $("#main_table").hide();
        $("#detailed_table").show();
      } else {
        $("#main_table").show();
        $("#detailed_table").hide();
      }
    });

    updateTables();
  });
});
