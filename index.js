let map;
let currentIndex = 0;
let score = 0;
let circle = null;
let correctMarker = null;

// 5 locations on CSUN campus
const locations = [
{
    name: "Baseball Field (F7)",
    position: { lat: 34.24515, lng: -118.52677 },
    radius: 70 
},
{
    name: "Oviatt Library",
    position: { lat: 34.24002, lng: -118.52932 },
    radius: 60
},
{
    name: "SRC Field",
    position: { lat: 34.23989, lng: -118.52398 },
    radius: 60
},
{
    name: "Parking Lot G6",
    position: { lat: 34.24319, lng: -118.52404 }, 
    radius: 60
},
{
    name: "Jacaranda Hall",
    position: { lat: 34.24126, lng: -118.52891 }, 
    radius: 50
}
];

function $(id) {
    return document.getElementById(id);
}

async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.244980, lng: -118.526679 }, // CSUN
        zoom: 15,
        mapTypeId: "roadmap",

        disableDoubleClickZoom: true,
    });

    // Double-click handler for guesses
    map.addListener("dblclick", function (e) {
        handleGuess(e.latLng);
    });

    // Button
    $("restartBtn").addEventListener("click", restartGame);

    startGame();
}

window.initMap = initMap;

function startGame() {
    currentIndex = 0;
    score = 0;
    clearCircleAndMarker();
    updateProgress();
    updateStatusText();
}

function restartGame() {
    startGame();
}

function updateStatusText(message) {
    if (!message) {
        const locationName = locations[currentIndex].name;
        $("status").textContent =
        "Double-click where you think \"" + locationName + "\" is.";
    } else {
        $("status").textContent = message;
    }
}

function updateProgress() {
    $("progress").textContent =
        "Location " +
        (currentIndex + 1) +
        " of " +
        locations.length +
        " | Score: " +
        score;
}


function clearCircleAndMarker() {
    if (circle) {
        circle.setMap(null);
        circle = null;
    }
    if (correctMarker) {
        correctMarker.setMap(null);
        correctMarker = null;
    }
}

function handleGuess(latLng) {
    // ignore extra clicks
    if (currentIndex >= locations.length) {
        return;
    }

    const location = locations[currentIndex];

    clearCircleAndMarker();

    // Distance in meters between guess and the target
    const targetLatLng = new google.maps.LatLng(
        location.position.lat,
        location.position.lng
    );
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        latLng,
        targetLatLng
    );

    const isCorrect = distance <= location.radius;

    if (isCorrect) {
        score++;
        updateStatusText("Your answer is correct! That was " + location.name + ".");
    } else {
        updateStatusText(
        "Incorrect! The correct area for " +
            location.name +
            " is shown in red."
        );
    }

    // Draw the correct area as a circle (green if correct, red if wrong)
    circle = new google.maps.Circle({
        map: map,
        center: location.position,
        radius: location.radius,
        fillColor: isCorrect ? "#00ff00" : "#ff0000",
        fillOpacity: 0.35,
        strokeColor: isCorrect ? "#008800" : "#880000",
        strokeWeight: 2
    });

    updateProgress();


    // console.log(currentIndex);

    // Move to the next location after a short delay
    setTimeout(function () {
        currentIndex++;

        if (currentIndex < locations.length) {
        clearCircleAndMarker();
        updateProgress();
        updateStatusText();
        } else {
        endGame();
        }
    }, 1500);
}

function endGame() {
    // final status text
    $("status").textContent =
        "Finished! Score: " +
        score +
        "/" +
        locations.length +
        ". Click \"Restart Game\" to play again.";
}