let cachedData = null; // Variable to store cached API response data

async function fetchFlights() {
    if (cachedData) {
        // If data is already cached, use it directly
        populateAirportList(cachedData,'first');
        populateAirportList(cachedData,'second');
        flightPrice(cachedData,0,'first');
        flightPrice(cachedData,1,'second');
        firstAirport(cachedData,'first');
        firstAirport(cachedData,'second');
        departureTime(cachedData,0,'first');
        departureTime(cachedData,1,'second');
        arrivalTime(cachedData,0,'first');
        arrivalTime(cachedData,1,'second');
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

            // populateAirportList(result,'first');
            // populateAirportList(result,'second');
            // flightPrice(result,0,'first');
            // flightPrice(result,1,'second');
            // firstAirport(result,'first');
            // firstAirport(result,'second');
            // departureTime(result,0,'first');
            // departureTime(result,1,'second');
            // arrivalTime(result,0,'first');
            // arrivalTime(result,1,'second');
            for ( var i = 0; i < 5; i++) {
                if (i === 0) {
                    var string = 'first';
                }

                else if (i === 1) {
                    var string = 'second';
                }

                else if (i === 2) {
                    var string = 'third';
                }

                else if (i === 3) {
                    var string = 'fourth';
                }

                else {
                    var string = 'fifth';
                }
                
                populateAirportList(result,string);
                flightPrice(result,i,string);
                firstAirport(result,string);
                departureTime(result,i,string);
                arrivalTime(result,i,string);

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

function flightPrice(data,number,string) {
    const flightList = document.getElementById(string+'Price');
    const price = data['data']['itineraries'][number].price.formatted;

    const markup = `<strong>Price: </strong> ${price}`;

    flightList.innerHTML = markup;
}

function populateAirportList(data,string) {
    const airportList = document.getElementById(string+'airportList');
    const airports = data['data']['filterStats']['airports'];

    const markup = `${airports[0]['city']} to ${airports[1]['city']}`
    airportList.innerText = markup
}

function firstAirport(data,string) {
    const airportList = document.getElementById(string+'Airport');
    const airports = data['data']['filterStats']['airports'];

    const markup = `<strong>Departure: </strong>${airports[0]['city']}`
    airportList.innerHTML = markup
}

function departureTime(data,number,string) {
    const airportList = document.getElementById(string+'Deperature');
    const time = data['data']['itineraries'][number]['legs'][0]['departure'].slice(11,16);

    const markup = `<strong>Departure Time:</strong> ${time}`;

    airportList.innerHTML = markup;
}

function arrivalTime(data,number,string) {
    const airportList = document.getElementById(string+'Arrival');
    const time = data['data']['itineraries'][number]['legs'][0]['arrival'].slice(11,16);

    const markup = `<strong>Arrival Time:</strong> ${time}`;

    airportList.innerHTML = markup;
}



// Call the async function
fetchFlights();
