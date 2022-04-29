/*
 * Vercel Link: https://restaurant-mqnefp81g-jrpatel47.vercel.app/
*/

var restaurantData = [];

var currentRestaurant = {};

var page = 1;

const perPage = 10;

var map = null;

function avg(grades) {
  var sum = 0;
  var avg = 0;

  for (var i = 0; i < grades.length; i++) {
    sum += grades[i].score;
  }

  avg = sum / grades.length;

  return avg.toFixed(2);
}

const tableRows = _.template(`
<% _.forEach(restaurants,rest=> { %>
    <tr data-id="<%- rest._id %>">
        <td><%- rest.name %></td>
        <td><%- rest.cuisine %></td>
        <td><%- rest.address.building %> <%- rest.address.street%></td>
        <td><%- avg(rest.grades) %></td>
        
    </tr>
<% }); %>`);

function loadRestaurantData() {
  fetch(
    `https://powerful-peak-14306.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
  )
    .then((res) => res.json())
    .then((data) => {
      restaurantData = data.restaurants;
      console.log(restaurantData);
      let trows = tableRows({ restaurants: restaurantData });
      console.log(trows);
      $("#restaurant-table tbody").html(trows);
      $("#current-page").html(page);
    });
}

$(function () {
  loadRestaurantData();

  $("#restaurant-table tbody").on("click", "tr", function (e) {
    let clickRows = $(this).attr("data-id");
    currentRestaurant = restaurantData.find(({ _id }) => _id == clickRows);

    $(".modal-title").html(`${currentRestaurant.name}`);
    $("#restaurant-address").html(
      `${currentRestaurant.address.building} ${currentRestaurant.address.street}`
    );

    $("#restaurant-modal").modal({
      backdrop: "static",
      keyboard: false,
    });
  });

  $("#previous-page").on("click", function (e) {
    if (page > 1) {
      page--;
    }
    loadRestaurantData();
  });

  $("#next-page").on("click", function (e) {
    page++;
    loadRestaurantData();
  });

  $("#restaurant-modal").on("shown.bs.modal", function () {
    map = new L.Map("leaflet", {
      center: [
        currentRestaurant.address.coord[1],
        currentRestaurant.address.coord[0],
      ],
      zoom: 18,
      layers: [
        new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
      ],
    });
    L.marker([
      currentRestaurant.address.coord[1],
      currentRestaurant.address.coord[0],
    ]).addTo(map);
  });

  $("#restaurant-modal").on("hide.bs.modal", function () {
    map.remove();
  });
});
