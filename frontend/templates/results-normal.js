
function parameters() {
    var params = new URLSearchParams(window.location.search);
    return {
        origin: params.get('fromEntityId'),
        end: params.get('toEntityid'),
        min_price: params.get('minimumPrice'),
        max_price:params.get('max_price'),
        dept_date: params.get('depart'),
        return_date: params.get('return_date')
    }
}

var city = 'madrid';


async function transformCity(city) {
    const url = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${city}`;
    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '76e3d7e612msha9b0c87d96f7361p175e04jsn7f8908586ac3',
		'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
	    }
    };

    try {
        let response = await fetch(url,options);

        let result = await response.json();

        const cityId = result['data'][0]['presentation']['skyId'];

        return cityId;

    } catch(error) {
        console.error(error)
    }
} 



let cachedData = null; // Variable to store cached API response data

async function fetchFlights() {
    try {
        // Get the cityId asynchronously
        const cityId = await transformCity(city);

        // Construct the URL using the cityId
        const url = `https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=${cityId}&toEntityId=ROME&departDate=2024-07-22&returnDate=2024-07-25&stops=direct`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '76e3d7e612msha9b0c87d96f7361p175e04jsn7f8908586ac3',
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        };

        // Fetch the flight data
        const response = await fetch(url, options);
        const result = await response.json();
        cachedData = result; // Cache the API response data

        // Process the result
        for (let i = 0; i < 5; i++) {
            let string;
            switch (i) {
                case 0:
                    string = 'first';
                    break;
                case 1:
                    string = 'second';
                    break;
                case 2:
                    string = 'third';
                    break;
                case 3:
                    string = 'fourth';
                    break;
                case 4:
                    string = 'fifth';
                    break;
            }

            populateAirportList(result, string);
            flightPrice(result, i, string);
            firstAirport(result, string);
            departureTime(result, i, string);
            arrivalTime(result, i, string);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
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
