// Get Flickr photos for each location
var ViewModel = function() {
  var self = this;
  self.filter = ko.observable('');

  self.nav = ko.observableArray([
    "Blue Bottle Coffee",
    "The Plant",
    "Cowgirl Creamery Cheese Shop",
    "Paramo Coffee",
    "Boulettes Larder"]);

  self.filteredNav = ko.computed(function() {
    var filter = self.filter();
    if (!filter) {
      return self.nav();
    }
    return self.nav().filter(function(i) {
      // Check for proper casing or lowercase
      return i.toLowerCase().indexOf(filter) > -1 || i.indexOf(filter) > -1;
    });
  });

  // Set default coordinates
  self.lat = ko.observable(37.796184);
  self.lon = ko.observable(-122.393799);

  self.flickrApi = ko.observable("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + self.lat() + "&lon=" + self.lon() + "&format=json&jsoncallback=?");

  self.srcs = ko.observableArray();

  $.getJSON(self.flickrApi())
    .done(function(data) {
      self.srcs(data);
    })
    .fail(function() {
      console.log("Error: Data did not load.");
    });
};

// If ko object exists, load Knockout.js
if (typeof ko === 'object') {
  var vm = new ViewModel();
  ko.applyBindings(vm);
} else {
  console.log("Error: Knockout.js did not load.");
}

// Highlight active list item
var highlightListItem = function(obj) {
  $(".mdl-navigation a").removeClass("mdl-navigation__link--current");
  $(obj).addClass("mdl-navigation__link--current");
};

$(".mdl-navigation a").on("click", function() {
  highlightListItem( this );
});

// Initialize Google map
function initMap() {
  // Create variable for DOM node in which to place Google map
  var mapDiv = document.getElementById('map');

  // Create variables for main navigational links
  var link0 = document.getElementById('link0');
  var link1 = document.getElementById('link1');
  var link2 = document.getElementById('link2');
  var link3 = document.getElementById('link3');
  var link4 = document.getElementById('link4');

  // Set defaults
  var zoomLevel = 17;

  var mapCenter = {
    lat: 37.796,
    lng: -122.396
  };
  var blueBottle = {
    lat: 37.796184,
    lng: -122.393799
  };
  var thePlant = {
    lat: 37.797913,
    lng: -122.396036
  };
  var cowgirlCreamery = {
    lat: 37.795760,
    lng: -122.393338
  };
  var paramoCoffee = {
    lat: 37.794628,
    lng: -122.396009
  };
  var boulettesLarder = {
    lat: 37.795514,
    lng: -122.393477
  };

  var places = [
    { lat: mapCenter.lat, lng: mapCenter.lng },
    { lat: blueBottle.lat, lng: blueBottle.lng },
    { lat: thePlant.lat, lng: thePlant.lng },
    { lat: cowgirlCreamery.lat, lng: cowgirlCreamery.lng },
    { lat: paramoCoffee.lat, lng: paramoCoffee.lng }
  ];

  // Create map
  var map = new google.maps.Map(mapDiv, {
    zoom: zoomLevel,
    center: mapCenter
  });

  // Set info display text
  var blueBottleInfo = '<h1 class="firstHeading">Blue Bottle</h1>';

  var blueBottleInfoWindow = new google.maps.InfoWindow({
    content: blueBottleInfo
  });

  var thePlantInfo = '<h1 class="firstHeading">The Plant</h1>';

  var thePlantInfoWindow = new google.maps.InfoWindow({
    content: thePlantInfo
  });

  var cowgirlCreameryInfo = '<h1 class="firstHeading">Cowgirl Creamery Cheese Shop</h1>';

  var cowgirlCreameryInfoWindow = new google.maps.InfoWindow({
    content: cowgirlCreameryInfo
  });

  var paramoCoffeeInfo = '<h1 class="firstHeading">Paramo Coffee</h1>';

  var paramoCoffeeInfoWindow = new google.maps.InfoWindow({
    content: paramoCoffeeInfo
  });

  var boulettesLarderInfo = '<h1 class="firstHeading">Boulettes Larder</h1>';

  var boulettesLarderInfoWindow = new google.maps.InfoWindow({
    content: boulettesLarderInfo
  });

  // Set markers
  var blueBottleMarker = new google.maps.Marker({
    position: blueBottle,
    map: map,
    title: 'Blue Bottle Coffee',
    animation: google.maps.Animation.DROP
  });
  var thePlantMarker = new google.maps.Marker({
    position: thePlant,
    map: map,
    title: 'The Plant',
    animation: google.maps.Animation.DROP
  });
  var cowgirlCreameryMarker = new google.maps.Marker({
    position: cowgirlCreamery,
    map: map,
    title: 'Cowgirl Creamery Cheese Shop',
    animation: google.maps.Animation.DROP
  });
  var paramoCoffeeMarker = new google.maps.Marker({
    position: paramoCoffee,
    map: map,
    title: 'Paramo Coffee',
    animation: google.maps.Animation.DROP
  });
  var boulettesLarderMarker = new google.maps.Marker({
    position: boulettesLarder,
    map: map,
    title: 'Boulettes Larder',
    animation: google.maps.Animation.DROP
  });

  var updateJson = function() {
    $.getJSON(vm.flickrApi())
      .done(function(data) {
        vm.srcs(data);
      })
      .fail(function() {
        console.log("Error: Data did not load.");
      });
  };

  var closeAllInfoWindows = function() {
    blueBottleInfoWindow.close();
    thePlantInfoWindow.close();
    cowgirlCreameryInfoWindow.close();
    paramoCoffeeInfoWindow.close();
    boulettesLarderInfoWindow.close();
  };

  var getBlueBottle = function() {
    highlightListItem( $("#link0") );
    map.panTo(blueBottle);
    closeAllInfoWindows();
    blueBottleInfoWindow.open(map, blueBottleMarker);
    vm.lat(blueBottle.lat);
    vm.lon(blueBottle.lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Blue%20Bottle&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getThePlant = function() {
    highlightListItem( $("#link1") );
    map.panTo(thePlant);
    closeAllInfoWindows();
    thePlantInfoWindow.open(map, thePlantMarker);
    vm.lat(thePlant.lat);
    vm.lon(thePlant.lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=The%20Plant%20cafe%20sf&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getCowgirlCreamery = function() {
    highlightListItem( $("#link2") );
    map.panTo(cowgirlCreamery);
    closeAllInfoWindows();
    cowgirlCreameryInfoWindow.open(map, cowgirlCreameryMarker);
    vm.lat(cowgirlCreamery.lat);
    vm.lon(cowgirlCreamery.lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Cowgirl%20Creamery&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getParamoCoffee = function() {
    highlightListItem( $("#link3") );
    map.panTo(paramoCoffee);
    closeAllInfoWindows();
    paramoCoffeeInfoWindow.open(map, paramoCoffeeMarker);
    vm.lat(paramoCoffee.lat);
    vm.lon(paramoCoffee.lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Paramo&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getBoulettesLarder = function() {
    highlightListItem( $("#link4") );
    map.panTo(boulettesLarder);
    closeAllInfoWindows();
    boulettesLarderInfoWindow.open(map, boulettesLarderMarker);
    vm.lat(boulettesLarder.lat);
    vm.lon(boulettesLarder.lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Boulettes%20Larder&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  // Add event listeners to handle info display on marker click
  blueBottleMarker.addListener('click', function() {
    getBlueBottle();
  });
  thePlantMarker.addListener('click', function() {
    getThePlant();
  });
  cowgirlCreameryMarker.addListener('click', function() {
    getCowgirlCreamery();
  });
  paramoCoffeeMarker.addListener('click', function() {
    getParamoCoffee();
  });
  boulettesLarderMarker.addListener('click', function() {
    getBoulettesLarder();
  });

  // Listen for DOM events
  google.maps.event.addDomListener(link0, 'click', function() {
      getBlueBottle();
  });
  google.maps.event.addDomListener(link1, 'click', function() {
      getThePlant();
  });
  google.maps.event.addDomListener(link2, 'click', function() {
      getCowgirlCreamery();
  });
  google.maps.event.addDomListener(link3, 'click', function() {
      getParamoCoffee();
  });
  google.maps.event.addDomListener(link4, 'click', function() {
      getBoulettesLarder();
  });
}

// If "google.maps" object loads (i.e., map script loads), load map
function hasMap() {
  if (typeof google.maps === 'object') {
    initMap();
  }
  else {
    console.log("Error: Map did not load.");
  }
}
