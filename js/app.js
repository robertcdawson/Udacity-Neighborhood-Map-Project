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
    // Set location name depending on argument passed:
      // List item returns object
      // Marker returns string
    var location_name = ( typeof obj === "string" ) ? obj : obj.name;
    var target = $(".mdl-navigation a:contains(" + location_name + ")");
    $(".mdl-navigation a").removeClass("mdl-navigation__link--current");
    $(target).addClass("mdl-navigation__link--current");
  };

  // Set default coordinates
  self.lat = ko.observable(37.796184);
  self.lon = ko.observable(-122.393799);

  // Set default Flickr API call
  self.flickrApi = ko.observable("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + self.lat() + "&lon=" + self.lon() + "&format=json&jsoncallback=?");

  // Create empty observable array
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
  
  var setLocationInfo = function() {
    var location_array = [];
    var infowindow_array = [];
    
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
    
    var locationInfo = function() {
      vm.highlightListItem( this.title );
      // map.panTo({
      //   lat: current_location.lat,
      //   lng: current_location.lng
      // });
      // closeAllInfoWindows();
      // current_infowindow.open(map, setLocationInfo().location[0]);
      // vm.lat(vm.locations[i].lat);
      // vm.lon(vm.locations[i].lng);
      // vm.flickrApi("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=594fb249392c0301ff092bb17a325a16&safe_search=1&per_page=10&lat=" + vm.lat() + "&lon=" + vm.lon() + "&text=Blue%20Bottle&sort=relevance&format=json&jsoncallback=?");
      // updateJson();
      // toggleBounce(location_array[i]);
    };
    
    // var current_infowindow, current_location;
    // current_infowindow = infowindow_array[i];
    // current_location = vm.locations[i];
    
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
      
      // Add event listeners to handle info display on marker click
      location_array[i].addListener('click', locationInfo);
      
      // Listen for DOM events
      // google.maps.event.addDomListener(document.getElementById('link' + i), 'click', locationInfo);
      
    }
    
    var closeAllInfoWindows = function() {
      var i = 0;
      for(i; i < vm.locations.length; i++) {
        infowindow_array[i].close();
      }
    };
  };
  
  setLocationInfo();
  
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
