"use strict";

$(document).ready(function() {
  $.get("ratings.json", function(data) {
    data = JSON.parse(data);
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

    var greenLevel = { avg: data[50].avgRate };
    var yelowLevel = { avg: data[10].avgRate };

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
      data.sort(function(a, b) {
        let aRate = -101;
        a.rates.forEach(rate => {
          if (rate.source == source) {
            aRate = rate.number;
          }
        });
        let bRate = -101;
        b.rates.forEach(rate => {
          if (rate.source == source) {
            bRate = rate.number;
          }
        });
        return bRate - aRate;
      });

      data[10].rates.forEach(rate => {
        if (rate.source == source) {
          yelowLevel[source] = rate.number;
        }
      });
      data[50].rates.forEach(rate => {
        if (rate.source == source) {
          greenLevel[source] = rate.number;
        }
      });
    });

    sources.forEach(source => {
      var th = document.createElement("th");
      th.innerText = source;
      var span = document.createElement("span");
      th.appendChild(span);
      $("#detailed_header")
        .children()
        .first()
        .append(th);
      $("#detailed_header1")
        .children()
        .first()
        .append($(th).clone());
    });

    var th = document.createElement("th");
    th.setAttribute("data-toggle", "tooltip");
    th.setAttribute("data-placement", "right");
    th.setAttribute("title", "Rating Aggregated Score");
    th.innerHTML = "RAS <span> <i class='fas fa-sort-down'></i> </span";
    $("#detailed_header")
      .children()
      .first()
      .append(th);
    $("#detailed_header1")
      .children()
      .first()
      .append($(th).clone());

    var th = document.createElement("th");
    $("#detailed_header")
      .children()
      .first()
      .append(th);
    $("#detailed_header1")
      .children()
      .first()
      .append($(th).clone());

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
        cell.innerText = i.goal ? Math.round(i.goal) + " BTC" : "";
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.raised ? Math.round(i.raised) + " BTC" : "";
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.isPre ? "Pre-ICO" : "ICO";
        row.appendChild(cell);

        var cell = document.createElement("td");
        cell.innerText = i.nRates;
        row.appendChild(cell);

        var cell = document.createElement("td");
        var h = document.createElement("h5");
        var span = document.createElement("span");
        var classList = ["badge"];
        if (i.avgRate >= yelowLevel.avg) {
          classList.push("badge-warning");
        } else if (i.avgRate >= greenLevel.avg) {
          classList.push("badge-success");
        } else {
          classList.push("badge-light");
        }
        classList.forEach(c => {
          span.classList.add(c);
        });
        span.innerText = i.avgRate;
        h.appendChild(span);
        cell.appendChild(h);
        row.appendChild(cell);

        var cell = document.createElement("td");
        var b = document.createElement("button");
        b.classList.add("btn");
        b.classList.add("btn-warning");
        b.innerText = "Invest";
        b.addEventListener("click", function(event, arg) {
          event.stopPropagation();
          var win = window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLScCG76ZsYTNWvrjyGDym1Qu7lW1YVaea-Ui3HxLdkTJzNYhog/viewform",
            "_blank"
          );
          win.focus();
        });
        cell.appendChild(b);
        row.appendChild(cell);

        row.setAttribute("data-toggle", "tooltip");
        row.setAttribute("data-placement", "right");
        row.setAttribute("data-html", "true");
        row.setAttribute("title", i.tooltipText);
        row.classList.add("ico");
        $("#main_body").append(row);
        $("#main_body1").append($(row).clone());
      });
      $("#main_body1").css("visibility", "hidden");
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
              if (rate.number >= yelowLevel[source]) {
                classList.push("badge-warning");
              } else if (rate.number >= greenLevel[source]) {
                classList.push("badge-success");
              } else {
                classList.push("badge-light");
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
        if (i.avgRate >= yelowLevel.avg) {
          classList.push("badge-warning");
        } else if (i.avgRate >= greenLevel.avg) {
          classList.push("badge-success");
        } else {
          classList.push("badge-light");
        }
        classList.forEach(c => {
          span.classList.add(c);
        });
        span.innerText = i.avgRate;
        h.appendChild(span);
        cell.appendChild(h);
        row.appendChild(cell);

        var cell = document.createElement("td");
        var b = document.createElement("button");
        b.classList.add("btn");
        b.classList.add("btn-warning");
        b.innerText = "Invest";
        b.addEventListener("click", function(event, arg) {
          event.stopPropagation();
          var win = window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLScCG76ZsYTNWvrjyGDym1Qu7lW1YVaea-Ui3HxLdkTJzNYhog/viewform",
            "_blank"
          );
          win.focus();
        });
        cell.appendChild(b);

        row.appendChild(cell);

        $("#detailed_body").append(row);
        $("#detailed_body1").append($(row).clone());
      });
      $("#detailed_body1").css("visibility", "hidden");
    }

    function sortRows(filteredData) {
      let activeTableId =
        $(".detailed.active").text() == "On"
          ? "#detailed_header"
          : "#main_header";
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

      console.log($(activeTableId).find(".fas"));
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
            let aRes = a.goal ? a.goal : -Infinity * reverse;
            let bRes = b.goal ? b.goal : -Infinity * reverse;
            res = bRes - aRes;
          } else if (columnName == "Raised") {
            let aRes = a.raised ? a.raised : -Infinity * reverse;
            let bRes = b.raised ? b.raised : -Infinity * reverse;
            res = bRes - aRes;
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
      var searchString = $("#search")
        .val()
        .toLowerCase();
      if (!$("#search").val()) {
        $("#clear").hide();
      }
      console.log(searchString);
      data.forEach(i => {
        if (
          i.nRates >= minRates &&
          (type == "All" ||
            (type == "ICO" && !i.isPre) ||
            (type == "Pre-ICO" && i.isPre)) &&
          (!searchString || i.name.toLowerCase().indexOf(searchString) !== -1)
        ) {
          filteredData.push(i);
        }
      });

      let sortedData = sortRows(filteredData);

      drawDetailedTable(sortedData);
      drawMainTable(sortedData);
      if ($(".detailed.active").text() == "On") {
        $("#main_table").hide();
        $("#main_table1").hide();
        $("#detailed_table").show();
        $("#detailed_table1").show();
        //$("#main_table").floatThead("destroy");
        //$("#detailed_table").floatThead();
      } else {
        $("#main_table").show();
        $("#main_table1").show();
        $("#detailed_table").hide();
        $("#detailed_table1").hide();
        //$("#detailed_table").floatThead("destroy");
        //$("#main_table").floatThead();
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

    $("#search").keyup(function() {
      if ($("#search").val()) {
        $("#clear").show();
      }
      updateTables();
    });
    $("#clear").click(function() {
      $("#search").val("");
      updateTables();
    });
    $("#topButton").click(function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    updateTables();
    $(window)
      .resize(function() {
        $(document.body).css(
          "margin-top",
          $("#page-header").height() -
            $("#main_body1").height() -
            $("#detailed_body1").height() -
            50
        );
      })
      .resize();
    //$("#detailed_table").hide();
  });
});
