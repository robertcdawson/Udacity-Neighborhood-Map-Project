// Get Flickr photos for each location
var ViewModel = function() {
  
  // Set this to "self" to better handle this binding
  var self = this;
  
  // Set list of locations
  self.locations = [
    {
      name: "Blue Bottle Coffee",
      lat: 37.796184,
      lng: -122.393799
    },
    {
      name: "The Plant Cafe Organic",
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

  // Create observable array
  self.nav = ko.observableArray(self.locations);
  
  // Create empty observable string
  self.filter = ko.observable('');

  // Show nav and filter
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
  
  // Highlight active list item when clicking list item or marker
  self.highlightListItem = function(obj) {
    // console.log(this.locations[0].name);
    // Set location name depending on argument passed:
      // List item returns object
      // Marker returns string
    var location_name;
    if (typeof obj === "string") location_name = obj;
    else if (typeof obj === "object") location_name = obj.name;
    
    var target = $(".mdl-navigation a:contains(" + location_name + ")");
    $(".mdl-navigation a").removeClass("mdl-navigation__link--current");
    $(target).addClass("mdl-navigation__link--current");
  };
  
  // Initialize locationInfo function as an observable
  self.panToLocation = ko.observable();
  
  self.location_array = ko.observableArray();
  self.infowindow_array = ko.observableArray();
  
  self.clickListItem = function(obj) {
    self.highlightListItem(obj);
    self.panToLocation(obj);
  };

  // Set default coordinates
  self.lat = ko.observable(37.796184);
  self.lon = ko.observable(-122.393799);

  // Set default Flickr API call
  self.flickrApi = ko.observable("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + self.lat() + "&lon=" + self.lon() + "&format=json&jsoncallback=?");

  // Create empty observable array
  self.srcs = ko.observableArray();
  
  self.updateJson = ko.observable();

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

// Initialize Google map
function initMap() {
  // Create variable for DOM node in which to place Google map
  var mapDiv = document.getElementById('map');

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
  
  var closeAllInfoWindows = function() {
    var i = 0;
    for(i; i < vm.locations.length; i++) {
      vm.infowindow_array[i].close();
    }
  };
  
  vm.panToLocation = function(location) {
    var name = ( location.title ) ? location.title : location.name;
    var lat = ( location.position ) ? location.position.lat() : location.lat;
    var lng = ( location.position ) ? location.position.lng() : location.lng;
    
    map.panTo({
      lat: lat,
      lng: lng
    });
    
    closeAllInfoWindows();
    
    // 1. Open infowindow when clicking marker
    // 2. Set latitude and longitude for Flickr API call
    // 3. Animate marker on click
    var i = 0;
    for (i; i < vm.locations.length; i++) {
      if ( vm.locations[i].name === name ) {
        vm.infowindow_array[i].open(map, vm.location_array[i]);
        vm.lat(vm.locations[i].lat);
        vm.lon(vm.locations[i].lng);
        toggleBounce(vm.location_array[i]);
      }
    }
    
    vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=" + name + "&sort=relevance&format=json&jsoncallback=?");
    vm.updateJson();
    
  };
  
  var clickMarker = function() {
    vm.highlightListItem( this.title );
    vm.panToLocation( this );
  }
  
  var setLocationInfo = function() {
    // Get Flickr data or fail gracefully with error message and page reload link
    vm.updateJson = function() {
      $.getJSON(vm.flickrApi())
        .done(function(data) {
          vm.srcs(data);
        })
        .fail(function() {
          $("#error_msg").html('"Error: Flickr data did not load. Please <a href="' + window.location.href + '">reload</a> to try again.').show();
        });
    };
    
    var i = 0;
    for(i; i < vm.locations.length; i++) {
      vm.location_array[i] = new google.maps.Marker({
        map: map,
        position: {
          lat: vm.locations[i].lat,
          lng: vm.locations[i].lng
        },
        title: vm.locations[i].name,
        animation: google.maps.Animation.DROP
      });
      
      vm.infowindow_array[i] = new google.maps.InfoWindow({
        content: '<h1 class="firstHeading">' + vm.locations[i].name + '</h1>'
      });
      
      // Add event listeners to handle info display on marker click
      vm.location_array[i].addListener('click', clickMarker);
      
    }
  };
  
  setLocationInfo();
  
}

// Get Google Maps script or fail gracefully with error message and page reload link

var map_url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCDm6-E4pK_fRcLMpRYEMnnaPKXYjl7aw";

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