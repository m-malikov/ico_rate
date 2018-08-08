"use strict";

var xhr = new XMLHttpRequest();
var hostname = "62.109.27.157";
xhr.onload = function() {
  var offset = 0;
  var levels = JSON.parse(xhr.response);
  $(document).ready(function() {
    var starredNames = new Set();
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
      $("#detailed_header")
        .children()
        .first()
        .append(th);
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

    var th = document.createElement("th");
    $("#detailed_header")
      .children()
      .first()
      .append(th);

    var th = document.createElement("th");
    $("#detailed_header")
      .children()
      .first()
      .append(th);

    function addMainRow(ico, num) {
      var row = document.createElement("tr");
      row.addEventListener("click", function() {
        document.location = ico.link;
      });

      var cell = document.createElement("td");
      cell.innerText = num;
      row.appendChild(cell);

      var cell = document.createElement("td");
      var link = document.createElement("a");
      link.href = ico.link;
      if (ico.logo) {
        var img = document.createElement("img");
        img.setAttribute("src", ico.logo);
        img.classList.add("ico-logo");
        link.appendChild(img);
      }
      cell.appendChild(link);
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = ico.name;
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = ico.goal ? Math.round(ico.goal) + " BTC" : "";
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = ico.raised ? Math.round(ico.raised) + " BTC" : "";
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = ico.isPre ? "Pre-ICO" : "ICO";
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = ico.rates.length;
      row.appendChild(cell);

      var cell = document.createElement("td");
      var h = document.createElement("h3");
      var span = document.createElement("span");
      var classList = ["badge"];
      if (ico.ras >= levels.ras.yellow) {
        classList.push("badge-warning");
      } else if (ico.ras >= levels.ras.green) {
        classList.push("badge-success");
      } else {
        classList.push("badge-light");
      }
      classList.forEach(c => {
        span.classList.add(c);
      });
      span.innerText = ico.ras;
      h.appendChild(span);
      cell.appendChild(h);
      row.appendChild(cell);

      var cell = document.createElement("td");
      if (starredNames.has(ico.name)) {
        cell.innerHTML = '<i class="fas fa-star text-warning"></i>';
      } else {
        cell.innerHTML = '<i class="far fa-star text-warning"></i>';
      }
      cell.classList.add("star");
      row.appendChild(cell);

      var cell = document.createElement("td");
      var b = document.createElement("button");
      b.classList.add("btn");
      b.classList.add("btn-warning");
      if (ico.isTop) {
        b.innerText = "Investdrop";
        b.addEventListener("click", function(event, arg) {
          event.stopPropagation();
          var win = window.open(
            "https://icoaggregator.idacb.com/investdrop/",
            "_blank"
          );
          win.focus();
        });
      } else {
        b.innerText = "Invest";
        b.addEventListener("click", function(event, arg) {
          event.stopPropagation();
          var win = window.open(
            "https://docs.goole.com/forms/d/e/1FAIpQLScCG76ZsYTNWvrjyGDym1Qu7lW1YVaea-Ui3HxLdkTJzNYhog/viewform",
            "_blank"
          );
          win.focus();
        });
      }
      cell.appendChild(b);
      row.appendChild(cell);

      row.classList.add("ico");
      $("#main_body").append(row);
    }

    function drawMainTable(starredData, data) {
      offset = 0;
      let num = 1;
      starredData.forEach(i => {
        addMainRow(i, num);
        num += 1;
      });
      num = 1;
      data.forEach(i => {
        addMainRow(i, num);
        num += 1;
      });
      if (data.length >= 100) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.setAttribute("colspan", 9);
        cell.innerText = "Show more";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        row.classList.add("ico");
        row.classList.add("showMore");
        row.addEventListener("click", function() {
          offset += 100;
          sendRequest(offset, function(data) {
            num = offset;
            data.forEach(i => {
              addMainRow(i, num);
              num += 1;
            });
            $("#main_body").append($(row));
          });
        });
      }
      $("#main_body").append(row);
      $('[data-toggle="tooltip"]').tooltip();
    }

    function drawDetailedRow(ico, num) {
      var row = document.createElement("tr");
      row.addEventListener("click", function() {
        document.location = ico.link;
      });

      var cell = document.createElement("td");
      cell.innerText = num;
      row.appendChild(cell);
      num += 1;

      var cell = document.createElement("td");
      if (ico.logo) {
        var img = document.createElement("img");
        img.setAttribute("src", ico.logo);
        img.classList.add("ico-logo");
        cell.appendChild(img);
      }
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.innerText = ico.name;
      row.appendChild(cell);
      row.classList.add("ico");

      sources.forEach(source => {
        var td = document.createElement("td");
        ico.rates.forEach(rate => {
          if (rate.source == source) {
            var h = document.createElement("h3");
            var span = document.createElement("span");
            var classList = ["badge"];
            if (rate.number >= levels[source].yellow) {
              classList.push("badge-warning");
            } else if (rate.number >= levels[source].green) {
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
      var h = document.createElement("h3");
      var span = document.createElement("span");
      var classList = ["badge"];
      if (ico.ras >= levels.ras.yellow) {
        classList.push("badge-warning");
      } else if (ico.ras >= levels.ras.green) {
        classList.push("badge-success");
      } else {
        classList.push("badge-light");
      }
      classList.forEach(c => {
        span.classList.add(c);
      });
      span.innerText = ico.ras;
      h.appendChild(span);
      cell.appendChild(h);
      row.appendChild(cell);

      var cell = document.createElement("td");
      if (starredNames.has(ico.name)) {
        cell.innerHTML = '<i class="fas fa-star text-warning"></i>';
      } else {
        cell.innerHTML = '<i class="far fa-star text-warning"></i>';
      }
      cell.classList.add("star");
      row.appendChild(cell);

      var cell = document.createElement("td");
      var b = document.createElement("button");
      b.classList.add("btn");
      b.classList.add("btn-warning");
      if (ico.isTop) {
        b.innerText = "Investdrop";
        b.addEventListener("click", function(event, arg) {
          event.stopPropagation();
          var win = window.open(
            "https://icoaggregator.idacb.com/investdrop/",
            "_blank"
          );
          win.focus();
        });
      } else {
        b.innerText = "Invest";
        b.addEventListener("click", function(event, arg) {
          event.stopPropagation();
          var win = window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLScCG76ZsYTNWvrjyGDym1Qu7lW1YVaea-Ui3HxLdkTJzNYhog/viewform",
            "_blank"
          );
          win.focus();
        });
      }
      cell.appendChild(b);

      row.appendChild(cell);

      $("#detailed_body").append(row);
    }
    function drawDetailedTable(starredData, data) {
      var num = 1;
      starredData.forEach(i => {
        drawDetailedRow(i, num);
        num += 1;
      });
      num = 1;
      data.forEach(i => {
        drawDetailedRow(i, num);
        num += 1;
      });
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      cell.setAttribute("colspan", 15);
      cell.innerText = "Show more";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      row.classList.add("ico");
      row.classList.add("showMore");
      row.addEventListener("click", function() {
        offset += 100;
        sendRequest(offset, function(data) {
          num = offset + 1;
          data.forEach(i => {
            drawDetailedRow(i, num);
            num += 1;
          });
          $("#detailed_body").append(row);
        });
      });
      $("#detailed_body").append(row);
    }

    function sendRequest(offset, callback) {
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
        .hasClass("fa-sort-down");

      var minRates = $(".nrates.active").text();
      var type = $(".status.active").text();

      var searchString = $(".search")
        .first()
        .val()
        .toLowerCase();

      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        callback(JSON.parse(xhr.response));
      };
      xhr.open("POST", "http://" + hostname + ":81", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      let params = {
        sortBy: columnName.toLowerCase(),
        reverse: reverse,
        minRates: +minRates,
        searchString: searchString,
        offset: offset,
        length: 100
      };
      if (status == "ICO") {
        params.isPre = false;
      } else if (status == "Pre-ICO") {
        params.isPre = true;
      }
      xhr.send(JSON.stringify(params));
    }

    function updateTables() {
      $("tr.ico").remove();

      let activeTableId =
        $(".detailed.active").text() == "On"
          ? "#detailed_header"
          : "#main_header";
      if (
        !$(".search")
          .first()
          .val()
      ) {
        $(".clear").hide();
      }

      sendRequest(0, function(data) {
        var xhr2 = new XMLHttpRequest();
        xhr2.onload = function() {
          console.log("callback!");
          var data2 = JSON.parse(xhr2.response);
          if (!data.length) {
            $("#noData").show();
          } else {
            $("noData").hide();
          }
          drawDetailedTable(data2, data);
          drawMainTable(data2, data);
          if ($(".detailed.active").text() == "On") {
            $("#main_table").hide();
            $("#main_row").hide();
            $("#detailed_table").show();
            $("#detailed_row").show();
          } else {
            $("#main_table").show();
            $("#main_row").show();
            $("#detailed_table").hide();
            $("#detailed_row").hide();
          }
          $(".star").click(function(evt) {
            evt.stopPropagation();
            var name = this.parentElement.childNodes[2].innerText;
            if (starredNames.has(name)) {
              starredNames.delete(name);
            } else {
              starredNames.add(name);
            }
            updateTables();
          });
          $(window).resize();
        };
        xhr2.open("POST", "http://" + hostname + ":81/by_names", true);
        xhr2.setRequestHeader("Content-Type", "application/json");
        xhr2.send(JSON.stringify(Array.from(starredNames)));
      });
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
      if (
        !$(this).text() ||
        $(this)
          .text()
          .includes("Clear")
      )
        return;

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

    $(".search").keyup(function() {
      $(".search").val($(this).val());
      if (
        $(".search")
          .first()
          .val()
      ) {
        $(".clear").show();
      }
      updateTables();
    });

    $(".clear").click(function() {
      $(".search").val("");
      updateTables();
    });

    $("#topButton").click(function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    updateTables();

    $(window).resize(function() {
      $(document.body).css("margin-top", $("#page-header").height() - 30);
    });
  });
};
xhr.open("POST", "http://" + hostname + ":81/levels", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();
