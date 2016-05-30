// Get Flickr photos for each location
var ViewModel = function() {
  var self = this;
  self.filter = ko.observable('');
  
  self.locations = [
    {
      name: "Blue Bottle Coffee",
      lat: 37.796184,
      lng: -122.393799
    },
    {
      name: "The Plant",
      lat: 37.797913,
      lng: -122.396036
    },
    {
      name: "Cowgirl Creamery Cheese Shop",
      lat: 37.795760,
      lng: -122.393338
    },
    {
      name: "Paramo Coffee",
      lat: 37.794628,
      lng: -122.396009
    },
    {
      name: "Boulettes Larder",
      lat: 37.795514,
      lng: -122.393477
    }
  ];

  self.nav = ko.observableArray(self.locations);

  self.filteredNav = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      return self.nav();
    }
    return self.nav().filter(function(i) {
      // Check for proper casing or lowercase
      return i.name.toLowerCase().indexOf(filter) > -1 || i.name.indexOf(filter) > -1;
    });
  });
  
  // Highlight active list item when clicking item
  self.highlightListItem = function(obj) {
    var target = $(".mdl-navigation a:contains(" + obj + ")");
    $(".mdl-navigation a").removeClass("mdl-navigation__link--current");
    $(target).addClass("mdl-navigation__link--current");
  };

  // Set default coordinates
  self.lat = ko.observable(37.796184);
  self.lon = ko.observable(-122.393799);

  self.flickrApi = ko.observable("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + self.lat() + "&lon=" + self.lon() + "&format=json&jsoncallback=?");

  self.srcs = ko.observableArray();

  // Load Flickr data or fail gracefully with error message and page reload link
  $.getJSON(self.flickrApi())
    .done(function(data) {
      self.srcs(data);
    })
    .fail(function() {
      $("#error_msg").html('Error: Flickr data did not load. Please <a href="' + window.location.href + '">reload</a> to try again.').show();
    });
};

// Load Knockout.js or fail gracefully with error message and page reload link
if (typeof ko === 'object') {
  var vm = new ViewModel();
  ko.applyBindings(vm);
} else {
  $("#error_msg").html('Error: Knockout.js did not load. Please <a href="' + window.location.href + '">reload</a> to try again.').show();
}

// Highlight active list item when clicking marker
var highlightListItem = function(obj) {
  $(".mdl-navigation a").removeClass("mdl-navigation__link--current");
  $(obj).addClass("mdl-navigation__link--current");
};

// $(".mdl-navigation a").on("click", function() {
//   highlightListItem( this );
// });

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

  // Initialize map
  var map = new google.maps.Map(mapDiv, {
    zoom: 17,
    center: {
      lat: 37.796,
      lng: -122.396
    },
    // Hide Map/Satellite links for better responsive experience
    disableDefaultUI: true
  });

  // Set info display text
  // var blueBottleInfo = '<h1 class="firstHeading">Blue Bottle</h1>';

  // var blueBottleInfoWindow = new google.maps.InfoWindow({
  //   content: blueBottleInfo
  // });

  // var thePlantInfo = '<h1 class="firstHeading">The Plant</h1>';

  // var thePlantInfoWindow = new google.maps.InfoWindow({
  //   content: thePlantInfo
  // });

  // var cowgirlCreameryInfo = '<h1 class="firstHeading">Cowgirl Creamery Cheese Shop</h1>';

  // var cowgirlCreameryInfoWindow = new google.maps.InfoWindow({
  //   content: cowgirlCreameryInfo
  // });

  // var paramoCoffeeInfo = '<h1 class="firstHeading">Paramo Coffee</h1>';

  // var paramoCoffeeInfoWindow = new google.maps.InfoWindow({
  //   content: paramoCoffeeInfo
  // });

  // var boulettesLarderInfo = '<h1 class="firstHeading">Boulettes Larder</h1>';

  // var boulettesLarderInfoWindow = new google.maps.InfoWindow({
  //   content: boulettesLarderInfo
  // });
  
  var setLocationInfo = function() {
    var location_array = [];
    var infowindow_array = [];
    var i = 0;
    for(i; i < vm.locations.length; i++) {
      location_array[i] = new google.maps.Marker({
        map: map,
        position: {
          lat: vm.locations[i].lat,
          lng: vm.locations[i].lng
        },
        title: vm.locations[i].name,
        animation: google.maps.Animation.DROP
      });
      
      infowindow_array[i] = new google.maps.InfoWindow({
        content: '<h1 class="firstHeading">' + vm.locations[i].name + '</h1>'
      });
    }
    return { 
      location: location_array,
      infowindow: infowindow_array
    };
  };

  // Get Flickr data or fail gracefully with error message and page reload link
  var updateJson = function() {
    $.getJSON(vm.flickrApi())
      .done(function(data) {
        vm.srcs(data);
      })
      .fail(function() {
        $("#error_msg").html('"Error: Flickr data did not load. Please <a href="' + window.location.href + '">reload</a> to try again.').show();
      });
  };

  var closeAllInfoWindows = function() {
    var i = 0;
    for(i; i < vm.locations.length; i++) {
      setLocationInfo().infowindow[i].close();
    }
  };

  var getBlueBottle = function() {
    highlightListItem( $("#link" + 0) );
    map.panTo({
      lat: vm.locations[0].lat,
      lng: vm.locations[0].lng
    });
    closeAllInfoWindows();
    setLocationInfo().infowindow[0].open(map, setLocationInfo().location[0]);
    vm.lat(vm.locations[0].lat);
    vm.lon(vm.locations[0].lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Blue%20Bottle&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getThePlant = function() {
    highlightListItem( $("#link" + 1) );
    map.panTo({
      lat: vm.locations[1].lat,
      lng: vm.locations[1].lng
    });
    closeAllInfoWindows();
    setLocationInfo().infowindow[1].open(map, setLocationInfo().location[1]);
    vm.lat(vm.locations[1].lat);
    vm.lon(vm.locations[1].lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=The%20Plant%20cafe%20sf&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getCowgirlCreamery = function() {
    highlightListItem( $("#link" + 2) );
    map.panTo({
      lat: vm.locations[2].lat,
      lng: vm.locations[2].lng
    });
    closeAllInfoWindows();
    setLocationInfo().infowindow[2].open(map, setLocationInfo().location[2]);
    vm.lat(vm.locations[2].lat);
    vm.lon(vm.locations[2].lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Cowgirl%20Creamery&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getParamoCoffee = function() {
    highlightListItem( $("#link" + 3) );
    map.panTo({
      lat: vm.locations[3].lat,
      lng: vm.locations[3].lng
    });
    closeAllInfoWindows();
    setLocationInfo().infowindow[3].open(map, setLocationInfo().location[3]);
    vm.lat(vm.locations[3].lat);
    vm.lon(vm.locations[3].lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Paramo&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };

  var getBoulettesLarder = function() {
    highlightListItem( $("#link" + 4) );
    map.panTo({
      lat: vm.locations[4].lat,
      lng: vm.locations[4].lng
    });
    closeAllInfoWindows();
    setLocationInfo().infowindow[4].open(map, setLocationInfo().location[4]);
    vm.lat(vm.locations[4].lat);
    vm.lon(vm.locations[4].lng);
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Boulettes%20Larder&sort=relevance&format=json&jsoncallback=?");
    updateJson();
  };
  
  // Animate marker on click
  // ref: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      // Bounce twice (bounce = 750ms)
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null)
      }, 1500);
    }
  }
  
  // Add event listeners to handle info display on marker click
  setLocationInfo().location[0].addListener('click', function() {
    console.log("blue bottle marker");
    getBlueBottle();
    toggleBounce(this);
  });
  setLocationInfo().location[1].addListener('click', function() {
    getThePlant();
    toggleBounce(this);
  });
  setLocationInfo().location[2].addListener('click', function() {
    getCowgirlCreamery();
    toggleBounce(this);
  });
  setLocationInfo().location[3].addListener('click', function() {
    getParamoCoffee();
    toggleBounce(this);
  });
  setLocationInfo().location[4].addListener('click', function() {
    getBoulettesLarder();
    toggleBounce(this);
  });

  // Listen for DOM events
  google.maps.event.addDomListener(link0, 'click', function() {
      getBlueBottle();
      toggleBounce(setLocationInfo().location[0]);
  });
  google.maps.event.addDomListener(link1, 'click', function() {
      getThePlant();
      toggleBounce(setLocationInfo().location[1]);
  });
  google.maps.event.addDomListener(link2, 'click', function() {
      getCowgirlCreamery();
      toggleBounce(setLocationInfo().location[2]);
  });
  google.maps.event.addDomListener(link3, 'click', function() {
      getParamoCoffee();
      toggleBounce(setLocationInfo().location[3]);
  });
  google.maps.event.addDomListener(link4, 'click', function() {
      getBoulettesLarder();
      toggleBounce(setLocationInfo().location[4]);
  });
}

var map_url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCDm6-E4pK_fRcLMpRYEMnnaPKXYjl7aw";

// Get Google Maps script or fail gracefully with error message and page reload link
$.getScript(map_url)
  .done(function() {
    initMap();
  })
  .fail(function() {
    $("#error_msg").html('Error: Map data did not load. Please <a href="' + window.location.href + '">reload</a> to try again.').show();
  });
  
// Cache .getScript AJAX request
$.ajaxSetup({
  cache: true
});
