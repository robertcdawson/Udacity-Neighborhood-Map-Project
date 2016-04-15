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
      return i.indexOf(filter) > -1;
    });
  });
};

ko.applyBindings(new ViewModel());

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

  // Create map
  var map = new google.maps.Map(mapDiv, {
    zoom: zoomLevel,
    center: mapCenter
  });

  // Set info display text
  var blueBottleInfo = '<div id="content">' +
    '<h1 class="firstHeading">Blue Bottle</h1>' +
    '<div>' +
    '<p>Lorem ipsum</p>' +
    '</div>' +
    '</div>';

  var blueBottleInfoWindow = new google.maps.InfoWindow({
    content: blueBottleInfo
  });

  var thePlantInfo = '<div id="content">' +
    '<h1 class="firstHeading">The Plant</h1>' +
    '<div>' +
    '<p>Lorem ipsum</p>' +
    '</div>' +
    '</div>';

  var thePlantInfoWindow = new google.maps.InfoWindow({
    content: thePlantInfo
  });

  var cowgirlCreameryInfo = '<div id="content">' +
    '<h1 class="firstHeading">Cowgirl Creamery Cheese Shop</h1>' +
    '<div>' +
    '<p>Lorem ipsum</p>' +
    '</div>' +
    '</div>';

  var cowgirlCreameryInfoWindow = new google.maps.InfoWindow({
    content: cowgirlCreameryInfo
  });

  var paramoCoffeeInfo = '<div id="content">' +
    '<h1 class="firstHeading">Paramo Coffee</h1>' +
    '<div>' +
    '<p>Lorem ipsum</p>' +
    '</div>' +
    '</div>';

  var paramoCoffeeInfoWindow = new google.maps.InfoWindow({
    content: paramoCoffeeInfo
  });

  var boulettesLarderInfo = '<div id="content">' +
    '<h1 class="firstHeading">Boulettes Larder</h1>' +
    '<div>' +
    '<p>Lorem ipsum</p>' +
    '</div>' +
    '</div>';

  var boulettesLarderInfoWindow = new google.maps.InfoWindow({
    content: boulettesLarderInfo
  });

  // Set markers
  var blueBottleMarker = new google.maps.Marker({
    position: blueBottle,
    map: map,
    title: 'Blue Bottle Coffee'
  });
  var thePlantMarker = new google.maps.Marker({
    position: thePlant,
    map: map,
    title: 'The Plant'
  });
  var cowgirlCreameryMarker = new google.maps.Marker({
    position: cowgirlCreamery,
    map: map,
    title: 'Cowgirl Creamery Cheese Shop'
  });
  var paramoCoffeeMarker = new google.maps.Marker({
    position: paramoCoffee,
    map: map,
    title: 'Paramo Coffee'
  });
  var boulettesLarderMarker = new google.maps.Marker({
    position: boulettesLarder,
    map: map,
    title: 'Boulettes Larder'
  });

  // Add event listeners to handle info display on marker click
  blueBottleMarker.addListener('click', function() {
    blueBottleInfoWindow.open(map, blueBottleMarker);
  });
  thePlantMarker.addListener('click', function() {
    thePlantInfoWindow.open(map, thePlantMarker);
  });
  cowgirlCreameryMarker.addListener('click', function() {
    cowgirlCreameryInfoWindow.open(map, cowgirlCreameryMarker);
  });
  paramoCoffeeMarker.addListener('click', function() {
    paramoCoffeeInfoWindow.open(map, paramoCoffeeMarker);
  });
  boulettesLarderMarker.addListener('click', function() {
    boulettesLarderInfoWindow.open(map, boulettesLarderMarker);
  });

  var closeAllInfoWindows = function() {
    blueBottleInfoWindow.close();
    thePlantInfoWindow.close();
    cowgirlCreameryInfoWindow.close();
    paramoCoffeeInfoWindow.close();
    boulettesLarderInfoWindow.close();
  };

  // Listen for DOM events
  google.maps.event.addDomListener(link0, 'click', function() {
      map.panTo(blueBottle);
      closeAllInfoWindows();
      blueBottleInfoWindow.open(map, blueBottleMarker);
  });
  google.maps.event.addDomListener(link1, 'click', function() {
      map.panTo(thePlant);
      closeAllInfoWindows();
      thePlantInfoWindow.open(map, thePlantMarker);
  });
  google.maps.event.addDomListener(link2, 'click', function() {
      map.panTo(cowgirlCreamery);
      closeAllInfoWindows();
      cowgirlCreameryInfoWindow.open(map, cowgirlCreameryMarker);
  });
  google.maps.event.addDomListener(link3, 'click', function() {
      map.panTo(paramoCoffee);
      closeAllInfoWindows();
      paramoCoffeeInfoWindow.open(map, paramoCoffeeMarker);
  });
  google.maps.event.addDomListener(link4, 'click', function() {
      map.panTo(boulettesLarder);
      closeAllInfoWindows();
      boulettesLarderInfoWindow.open(map, boulettesLarderMarker);
  });

  // Get Flickr photos for each location
  var flickrApi = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=907dea022b0dfc2ec993df236bc0fe6c&safe_search=1&per_page=5&lat=37.796184&lon=-122.393799&format=json&jsoncallback=?";
  var src;
  var jqxhr = $.getJSON(flickrApi)
    .done(function(data) {
      $.each(data.photos.photo, function(i, item) {
        src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
        $("<img/>").attr("src", src).appendTo("#images");
      });
    })
    .fail(function() {
      $("#images").html("Oops, something went wrong. Please reload this page to try again.");
    });
    jqxhr.complete(function() {
      console.log( "src", src );
    });

}
