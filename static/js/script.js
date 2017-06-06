/*
 Created on.
*/


// Declare Closure Variables
let map;


function addStopToTable(index, bus){
    //Make some table html in jQuery Here

    // <tr>
    //   <th scope="row">1</th>
    //   <td>Jacob</td>
    //   <td>Thornton</td>
    //   <td>@fat</td>
    // </tr>

    let busStopIndex = $('<th>', {'scope': 'row'}).text(index+1);
    let busLocID = $('<td>').text(bus.locid);
    let busStopDesc = $('<td>').text(bus.desc);
    let busHeading = $('<td>').text(bus.dir);
    let busStopRow = $('<tr>').append(busStopIndex, busLocID, busHeading, busStopDesc);

    $('#busses').append(busStopRow);
}


function addBusStopMarker(bus) {

    let busStopLoc = new google.maps.LatLng(bus.lat, bus.lng);



    let stopMarker = new google.maps.Marker({
        position: bus,
        title: bus.desc,
        map: map,
    });

    // To add the marker to the map, call setMap();
    stopMarker.setMap(map);
}


function addMarkers(busses){
    //Adds a collections of busses to map and table
    let iconBase = 'static/images/tourist-bus-icon_lg.png';

    $.each(busses, function(index, bus) {
        console.log(bus);

        //Change default Google icon
        let iconBase = 'static/images/tourist-bus-icon_lg.png';

        //Adds a single bus stop to the map
        let stopMarker = new google.maps.Marker({
          position: bus,
          map: map,
          icon: iconBase
        });

        // Make Info Windows
        let $content = $('<div>', {id: "content"});
        let $siteNotice = $('<div>', {id: "siteNotice"});
        let headings = $('<h1>', {id: "firstHeading"}, {class: "firstHeading"});
        let $bodyContent = $('<div>', {id: "bodyContent"}, '<p>');

        let contentString =

      //   var contentString = '<div id="content">'+
      // '<div id="siteNotice">'+
      // '</div>'+
      // '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      // '<div id="bodyContent">'+
      // '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      // 'sandstone rock formation in the southern part of the '+
      // 'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      // 'south west of the nearest large town, Alice Springs; 450&#160;km '+
      // '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      // 'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      // 'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      // 'Aboriginal people of the area. It has many springs, waterholes, '+
      // 'rock caves and ancient paintings. Uluru is listed as a World '+
      // 'Heritage Site.</p>'+
      // '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      // 'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      // '(last visited June 22, 2009).</p>'+
      // '</div>'+
      // '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
        });

      stopMarker.addListener('click', function() {
      infowindow.open(map, stopMarker);
      });

    // To add the marker to the map, call setMap();
    stopMarker.setMap(map);

    addStopToTable(index, bus);

    });}


function fetch(here){
    // AJAX request
    let data;

    let lat = here.coords.latitude;
    let long = here.coords.longitude;

    //Object Request
    let req_params = {'appID': 'DD56C4E4A2D654695936E059E',
                      'json': 'true',
                      'll': `${lat}, ${long}`,
                      'meters': '200'};

    $.ajax({
        url: 'https://developer.trimet.org/ws/V1/stops',
        method: 'GET',
        data: req_params,
        success: function(response){
            console.log(response);
            data = response;
            let busses = response.resultSet.location;
            addMarkers(busses);
        },
        error: function(error){
            console.log(error);
        }
    });
}


// jQuery UI Snap to Increment slider
$( function() {
    $( "#slider" ).slider({
      value: 100,
      min: 0,
      max: 1000,
      step: 50,
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value + " meters");
        // stop: function( event, ui ) {
        //
        // }
      }
    });
    $( "#amount" ).val( $( "#slider" ).slider( "value" ) + " meters");
  } );



function initMap(position) {
        let here = {lat: position.coords.latitude, lng: position.coords.longitude};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: here
        });
        let marker = new google.maps.Marker({
          position: here,
          map: map
        });
      }


function getPosition() {
    // If the object exists, geolocation services are available. You can test for the presence of geolocation with this code:
    if ("geolocation" in navigator) {
        /* geolocation is available */
        console.log("Geo location is available!");

        //To obtain the user's current location, you can call the getCurrentPosition() method.
        navigator.geolocation.getCurrentPosition(function (position) {
            // console.log(position);
        // Call Google Init Function for MAP and MARKER
        initMap(position);
        fetch(position);
        });

    } else {
        /* geolocation IS NOT available */
        console.log("No location available");
    }
}


