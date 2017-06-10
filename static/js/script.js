/*
 Created by Steve Hanlon on June 5, 2017.
*/


// Declare Closure Variables
let map;
let stopMarkers = [];



// $('#buses_here_btn').on('click', function (event, ui) {
//             console.log('Button works');
//
//     });



function addStopToTable(index, bus){
    //Make Bus Schedule HTML table with jQuery

    // <tr>
    //   <th scope="row">1</th>
    //   <td>Jacob</td>
    //   <td>Thornton</td>
    //   <td>@fat</td>
    // </tr>


    let busStopIndex = $('<th>', {'scope': 'row'});
    let busLocID = $('<td>').text(bus.locid);
    let busStopDesc = $('<td>').text(bus.desc);
    let busHeading = $('<td>').text(bus.dir);
    let busStopRow = $('<tr>').append(busStopIndex, busLocID, busHeading, busStopDesc);

    $('#buses').append(busStopRow);
}


function addMarker(busStop) {
    // Make Info Windows

    let contentString = makeInfoWindow(busStop);

    let infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    let iconPath = 'static/images/tourist-bus-icon_lg.png';     //Change default Google icon

    let stopMarker = new google.maps.Marker({
        position: busStop,
        map: map,
        icon: iconPath
    });

    stopMarker.setMap(map);                                 //Adds a single bus stop to the map

    stopMarker.addListener('click', function () {
        infowindow.open(map, stopMarker);
    });

    stopMarkers.push(stopMarker);                        // Push to stopMarker array
}


function makeInfoWindow(busStop, busArrTime) {
    //Generates and adds info-window HTML and Google Map marker objects

    // desc:"SW Kelly & Corbett"
    // dir: "Northbound"
    // lat:45.5019212692922
    // lng:-122.675276776225
    // locid:3116

    let $headings = $('<h5>', {id: "firstHeading"}, {class: "firstHeading"}).text('Bus: #' + busStop.locid);

    let $bodyContent = $('<div>', {id: "bodyContent"}).text('Bus: #');
    let $busDetails = $('<p>', {id: "busDetails"}).text('Direction:' + busStop.dir + 'Stop Location:' + busStop.desc);

    let $content = $('<main>').append($headings, $bodyContent);
    return $content.html();
}


// AJAX REQUEST for ARRIVAL TIMES
function fetchArrivals(locID) {
    let data;

    //MAYBE EACH LOOP HERE TO GEt LOCID FROM BUSES AJAX CALL

    //Object Request
    let arrive_params = {
        'appID': 'DD56C4E4A2D654695936E059E',
        'json': 'true',
        'locIDs': locID,
        'arrivals': '2'
    };

    $.ajax({
        url: 'https://developer.trimet.org/ws/V1/arrivals',
        method: 'GET',
        data: arrive_params,
        success: function (response) {
            console.log("AJAX fetchArrivals success!");
            console.log(response);
            data = response;
            let busArrTimes = response.resultSet.arrival;
            addStopToTable(busArrTimes.estimated);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function addBusStopMarkers(busStops) {
    //Adds a collections of buses to map and table
    let iconBase = 'static/images/tourist-bus-icon_lg.png';

    $.each(busStops, function (index, busStop) {
        console.log("AddBusStopMarkers works!");
        addStopToTable(index, busStop);                     // Adds stopMarker to the table
        addMarker(busStop);                                 // Adds stopMarker to the map
        fetchArrivals(busStop.locid);
        console.log(busStop);

    });
}


// AJAX REQUEST for LAT LONG and METERS
function fetch(here, meters) {
    //Sets meters to a default value (e.g. 600) if undefined
    if ( typeof meters === 'undefined' ) {
        let meters = '600';
    }
    let data;

    let lat = here.coords.latitude;
    let long = here.coords.longitude;

    //Object Request
    let req_params = {
        'appID': 'DD56C4E4A2D654695936E059E',
        'json': 'true',
        'll': `${lat}, ${long}`,
        'meters': meters
    };

    $.ajax({
        url: 'https://developer.trimet.org/ws/V1/stops',
        method: 'GET',
        data: req_params,
        success: function (response) {
            console.log("AJAX Fetch Location success!");
            console.log(response);
            data = response;
            let buses = response.resultSet.location;
            addBusStopMarkers(buses);
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function setMapOnAll(map) {
    // Sets the map on all markers in the array.
    $.each(stopMarkers, function (index, stopMarker) {
        stopMarker.setMap(map);
    });
}


/*-----------------------------
  GOOGLE CODE TO CLEAR MARKERS
 ----------------------------*/
function clearMarkers() {
    // Removes the markers from the map, but keeps them in the array.
    setMapOnAll(null);
}


function showMarkers() {
    // Shows any markers currently in the array.
    setMapOnAll(map);
}


function deleteMarkers() {
    // Deletes all markers in the array by removing references to them.
    clearMarkers();
    stopMarkers = [];
}


function clearMap() {
    // Clears all the markers from the map
}


function clearTable() {
    // Clears all the records from the table
    $("#buses").empty();
}

/*--------------
SLIDER FUNCTIONS
----------------*/

function updateStops(event, ui) {
    console.log('Slider just stopped');
    // Get Geolocation
    // Get new bus data
    //To obtain the user's current location, you can call the getCurrentPosition() method.
    navigator.geolocation.getCurrentPosition(function (position) {
        fetch(position, ui.value);
    });

    // Clear the map
    clearMarkers();
    // Clear the Table
    clearTable();
    // Update the map
}



$(function () {
    // jQuery UI Snap-to Increment SLIDER
    let options = {
        value: 600, min: 0, max: 1000, step: 100,
        slide: function (event, ui) {
            $("#amount").val(ui.value + " meters");
        },
        stop: updateStops  // function object
    };

    $("#slider").slider(options);

    $("#amount").val($("#slider").slider("value") + " meters");
});




/*--------------
GOOGLE FUNCTIONS
----------------*/
function initMap(position) {
    // GOOGLE MAP CODE to use their maps, set zoom, and use their markers connected to geolocation function below
    let here = {lat: position.coords.latitude, lng: position.coords.longitude};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: here
    });
    let marker = new google.maps.Marker({
        position: here,
        label: "I'm here!",
        animation: google.maps.Animation.BOUNCE,  //BOUNCE is another animation option
        draggable: true,

        map: map
    });
    console.log("Init Map works!");
}


let getPosition = function () {
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
};

// Activates Button "Where am I" to load map with user's current location
$('#im_here_btn').click(getPosition);
