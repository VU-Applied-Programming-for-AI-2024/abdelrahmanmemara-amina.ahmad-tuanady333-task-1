let cachedData = null; // Variable to store cached API response data

async function fetchFlights() {
    if (cachedData) {
        // If data is already cached, use it directly
        populateFlightList(cachedData);
        populateAirportList(cachedData);
    } else {
        const url = 'https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=PARI&toEntityId=ROME&departDate=2024-06-22&returnDate=2024-06-25&market=US&currency=USD&stops=direct';
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

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

function populateFlightList(data) {
    const flightList = document.getElementById('flightList');
    data['data']['itineraries'].slice(0, 5).forEach(flight => {
        const markup = `<li>${flight.price.formatted}</li>`;
        flightList.insertAdjacentHTML('beforeend', markup);
    });
}

function populateAirportList(data) {
    const airportList = document.getElementById('airportList');
    data['data']['filterStats']['airports'].forEach(airport => {
        const markup = `<p>${airport.city}</p>`;
        airportList.insertAdjacentHTML('beforeend', markup);
    });
}

// Call the async function
fetchFlights();
