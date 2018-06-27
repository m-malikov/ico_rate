"use strict";

$(document).ready(function() {
  $.get("ratings.json", function(data) {
    //data = JSON.parse(data)
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
    ];

    sources.forEach(source => {
      var th = document.createElement("th");
      th.innerText = source;
      var span = document.createElement("span");
      th.appendChild(span);
      $("#detailed_header").append(th);
    });

    var th = document.createElement("th");
    th.innerText = "RAS";
    $("#detailed_header").append(th);

    var th = document.createElement("th");
    $("#detailed_header").append(th);

    function drawMainTable(filteredData) {
      let num = 1;
      filteredData.forEach(i => {
        var row = document.createElement("tr");
        row.addEventListener("click", function() {
          document.location = i.link;
        });

        var cell = document.createElement("td");
        cell.innerText = num;
        row.appendChild(cell);
        num += 1;

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
        cell.innerText = i.name;
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.raised;
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.goal;
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.isPre ? "Pre-ICO" : "ICO";
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
        cell.innerHTML = "<button class='btn btn-warning'>Invest</button";
        row.appendChild(cell);

        row.setAttribute("data-toggle", "tooltip");
        row.setAttribute("data-placement", "right");
        row.setAttribute("data-html", "true");
        row.setAttribute("title", i.tooltipText);
        row.classList.add("ico");
        $("#main_table").append(row);
      });
      $('[data-toggle="tooltip"]').tooltip();
    }

    function drawDetailedTable(filteredData) {
      var num = 1;
      filteredData.forEach(i => {
        var row = document.createElement("tr");
        row.addEventListener("click", function() {
          document.location = i.link;
        });

        var cell = document.createElement("td");
        cell.innerText = num;
        row.appendChild(cell);
        num += 1;

        var cell = document.createElement("td");
        if (i.logo) {
          var img = document.createElement("img");
          img.setAttribute("src", i.logo);
          img.classList.add("ico-logo");
          cell.appendChild(img);
        }
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.name;
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
              span.innerText = rate.verbose
                .trim()
                .replace(", ", "\n")
                .replace(":", "\n")
                .replace(":", "\n");
              td.innerHTML = "";
              h.appendChild(span);
              td.appendChild(h);
            }
          });
          row.appendChild(td);
        });

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
        cell.innerHTML = "<button class='btn btn-warning'>Invest</button";
        row.appendChild(cell);

        $("#detailed_table").append(row);
      });
    }

    function sortRows(filteredData) {
      let activeTableId =
        $(".detailed.active").text() == "On"
          ? "#detailed_table"
          : "#main_table";
      let columnName = $(activeTableId)
        .find(".fas")
        .parent()
        .parent()
        .text()
        .trim();
      let reverse = $(activeTableId)
        .find(".fas")
        .hasClass("fa-sort-up")
        ? -1
        : 1;

      console.log(columnName, reverse);

      function strcmp(s1, s2) {
        return s1 < s2 ? -1 : +(s1 > s2);
      }

      function compare(a, b) {
        if ($.inArray(columnName, sources) != -1) {
          let aRate = -101 * reverse;
          a.rates.forEach(rate => {
            if (rate.source == columnName) {
              aRate = rate.number;
            }
          });
          let bRate = -101 * reverse;
          b.rates.forEach(rate => {
            if (rate.source == columnName) {
              bRate = rate.number;
            }
          });
          return (bRate - aRate) * reverse;
        } else {
          var res;
          if (columnName == "Name") {
            res = strcmp(a.name, b.name);
          } else if (columnName == "RAS") {
            res = b.avgRate - a.avgRate;
          } else if (columnName == "Number of rates") {
            res = b.nRates - a.nRates;
          } else if (columnName == "Type") {
            res = a.isPre - b.isPre;
          } else if (columnName == "Goal") {
            res = strcmp(a.goal.trim(), b.goal.trim());
          } else if (columnName == "Raised") {
            res = strcmp(a.raised.trim(), b.raised.trim());
          }
          return res * reverse;
        }
      }
      let sortedData = filteredData.sort(compare);
      return sortedData;
    }

    function updateTables() {
      $("tr.ico").remove();

      var minRates = $(".nrates.active").text();
      var type = $(".status.active").text();

      let filteredData = [];
      data.forEach(i => {
        if (
          i.nRates >= minRates &&
          (type == "All" ||
            (type == "ICO" && !i.isPre) ||
            (type == "Pre-ICO" && i.isPre))
        ) {
          filteredData.push(i);
        }
      });

      let sortedData = sortRows(filteredData);

      if ($(".detailed.active").text() == "On") {
        $("#main_table").hide();
        $("#detailed_table").show();
        drawDetailedTable(sortedData);
      } else {
        $("#main_table").show();
        $("#detailed_table").hide();
        drawMainTable(sortedData);
      }
    }

    $("div.btn-group button").click(function() {
      $(this)
        .parent()
        .children()
        .removeClass("active");
      $(this).addClass("active");
      updateTables();
    });

    $("#detailed_table").hide();

    $("th").click(function() {
      if (!$(this).text()) return;

      var isReversed =
        $(this)
          .children()
          .first()
          .html() == ' <i class="fas fa-sort-down"></i>';
      $(this)
        .parent()
        .find("span")
        .html("");
      $(this)
        .children()
        .first()
        .html(
          isReversed
            ? ' <i class="fas fa-sort-up"></i>'
            : ' <i class="fas fa-sort-down"></i>'
        );
      updateTables();
    });
    updateTables();
  });
});
