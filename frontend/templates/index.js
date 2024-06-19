let cachedData = null; // Variable to store cached API response data

async function fetchFlights() {
    if (cachedData) {
        // If data is already cached, use it directly
        populateFlightList(cachedData);
        populateAirportList(cachedData);
        firstAirport(cachedData);
        departureTime(cachedData);
        arrivalTime(cachedData);
    } else {
        const url = 'https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=PARI&toEntityId=ROME&departDate=2024-07-22&returnDate=2024-07-25&stops=direct';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '76e3d7e612msha9b0c87d96f7361p175e04jsn7f8908586ac3',
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            cachedData = result; // Cache the API response data

            populateFlightList(result);
            populateAirportList(result);
            firstAirport(result);
            departureTime(result);
            arrivalTime(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

function populateFlightList(data) {
    const flightList = document.getElementById('firstPrice');
    const price = data['data']['itineraries'][0].price.formatted;

    const markup = `<strong>Price: </strong> ${price}`;

    flightList.innerHTML = markup;
}

function populateAirportList(data) {
    const airportList = document.getElementById('airportList');
    const airports = data['data']['filterStats']['airports'];

    const markup = `${airports[0]['city']} to ${airports[1]['city']}`
    airportList.innerText = markup
}

function firstAirport(data) {
    const airportList = document.getElementById('firstAirport');
    const airports = data['data']['filterStats']['airports'];

    const markup = `<strong>Departure: </strong>${airports[0]['city']}`
    airportList.innerHTML = markup
}

function departureTime(data) {
    const airportList = document.getElementById('firstDeperature');
    const time = data['data']['itineraries'][0]['legs'][0]['departure'].slice(11,16);

    const markup = `<strong>Departure Time:</strong> ${time}`;

    airportList.innerHTML = markup;
}

function arrivalTime(data) {
    const airportList = document.getElementById('firstArrival');
    const time = data['data']['itineraries'][0]['legs'][0]['arrival'].slice(11,16);

    const markup = `<strong>Arrival Time:</strong> ${time}`;

    airportList.innerHTML = markup;
}



// Call the async function
fetchFlights();
