// Function to extract URL parameters
function parameters() {
    var params = new URLSearchParams(window.location.search);
    return {
        origin: params.get('fromEntityId'),
        end: params.get('toEntityid'),
        min_price: params.get('min_price'),
        max_price: params.get('max_price'),
        dept_date: params.get('depart'),
        return_date: params.get('return_date')
    }
}

// Get URL parameters
var param = parameters();

// Function to show loading alert
function showLoadingAlert() {
    $('#loadingAlert').fadeIn();
}

// Function to hide loading alert
function hideLoadingAlert() {
    $('#loadingAlert').fadeOut();
}

// Function to fetch weather data based on city and date
async function weatherAPI(cityTo, date) {
    const fixed_date = date.slice(6,11);
    const url1 = `http://api.openweathermap.org/geo/1.0/direct?q=${cityTo}&limit=1&appid=76dcae341cd27c351c448e898edca058`;
    const first_response = await fetch(url1);
    const latitude_longitude = await first_response.json();
    const lon = latitude_longitude[0]['lon'];
    const lat = latitude_longitude[0]['lat'];

    const url = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=2023-${fixed_date}&appid=76dcae341cd27c351c448e898edca058`;

    const response = await fetch(url);
    const result = await response.json();

    return result;
}

// Function to transform city name into cityId
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
        let response = await fetch(url, options);
        let result = await response.json();
        const cityId = result['data'][0]['presentation']['skyId'];
        return cityId;
    } catch(error) {
        console.error(error);
    }
} 

// Function to generate flight card markup
async function generateCard(result, cityId, cityTo, number) {
    const html = document.getElementById('main');
    const city_name = populateAirportList(result);
    const price = flightPrice(result, number);
    const dept_time = departureTime(result, number);
    const arrival_time = arrivalTime(result, number);
    const airport = firstAirport(result);
    const weather = await weatherAPI(param['end'], param['dept_date']);
    const temp = weather['temperature']['min'];
    const wind = weather['wind']['max']['speed'];
    const humidity = weather['humidity']['afternoon'];
    const percipitation = weather['precipitation']['total'];
    const url = skyscannerLink(cityId, cityTo, param['dept_date'], param['return_date']);
    const markup = `<div class="row">
            <div class="col-md-12">
                <div class="flight-card">
                    <h2 class="text-dark" id="firstairportList">${city_name}</h2>
                    <div class="flight-info">
                        <p id="firstAirport"><strong>Departure: </strong> ${airport} </p>
                        <p id="firstDeperature"><strong>Departure time: </strong>${dept_time}</p>
                        <p id="firstArrival"> <strong>Arrival time: </strong>${arrival_time}</p>
                        <p id="firstPrice"><strong>Price: </strong> ${price}</p>
                        <p><strong>Precipitation:</strong> ${percipitation} </p>
                        <p><strong>Temperature at Arrival:</strong> ${temp}°F</p>
                        <p><strong>Wind at Arrival:</strong> ${wind} mph</p>
                        <p><strong>Humidity at Arrival:</strong> ${humidity}%</p>
                    </div>
                    <a href="${url}" class="btn btn-secondary">Book Now</a>
                </div>
            </div>
        </div>`;
    
    html.insertAdjacentHTML('beforeend', markup);
}

// Function to fetch flights based on search criteria
async function fetchFlights() {
    try {
        showLoadingAlert(); // Show loading alert

        // Transform origin city name into cityId
        const cityId = await transformCity(param['origin']);
        // Transform destination city name into cityId
        const cityTo = await transformCity(param['end']);

        // Construct URL for flight search
        const url = `https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=${cityId}&toEntityId=${cityTo}&departDate=${param['dept_date']}&returnDate=${param['return_date']}&stops=direct`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '76e3d7e612msha9b0c87d96f7361p175e04jsn7f8908586ac3',
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        };

        // Fetch flight data
        const response = await fetch(url, options);
        const result = await response.json();
        var resultsLength = result['data']['itineraries'].length;
        let flightCount = 0;

        console.log(resultsLength);

        // Process the result
        for (let i = 0; i < resultsLength; i++) {
            const priceStr = flightPrice(result, i);
            const price = parsePrice(priceStr);

            // Check if the price is within the specified range
            if (price >= parsePrice(param['min_price']) && price <= parsePrice(param['max_price'])) {
                generateCard(result, cityId, cityTo, i);
                flightCount++;
            }
        }

        // Display number of flights found
        document.getElementById('count').insertAdjacentHTML('beforeend', `<p><strong>Number of Flights Found:</strong> ${flightCount}</p>`);

        // Display message if no results found
        if (flightCount === 0) {
            document.getElementById('main').insertAdjacentHTML('beforeend', `<div class="row">
                <div class="col-md-12">
                    <div class="flight-card">
                        <p> No results found </p>
                    </div>
                </div>
            </div>`);
        }

        hideLoadingAlert(); // Hide loading alert
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingAlert(); // Hide loading alert on error
    }
}

// Function to parse price string into number
function parsePrice(priceStr) {
    return Number(priceStr.replace(/[^0-9.-]+/g, ""));
}

// Function to extract flight price from data
function flightPrice(data, number) {
    const price = data['data']['itineraries'][number]['price']['formatted'];
    return price;
}

// Function to populate airport list
function populateAirportList(data) {
    const airports = data['data']['filterStats']['airports'];
    const markup = `${airports[0]['city']} to ${airports[1]['city']}`;
    return markup;
}

// Function to get first airport name
function firstAirport(data) {
    const airports = data['data']['filterStats']['airports'][0]['airports'][0]['name'];
    return airports;
}

// Function to get departure time
function departureTime(data, number) {
    const time = data['data']['itineraries'][number]['legs'][0]['departure'].slice(11,16);
    return time;
}

// Function to get arrival time
function arrivalTime(data, number) {
    const time = data['data']['itineraries'][number]['legs'][0]['arrival'].slice(11,16);
    return time;
}

// Function to generate Skyscanner booking link
function skyscannerLink(cityId, cityTo, dept_date, arrival_date) {
    const dept = dept_date.slice(2,4) + dept_date.slice(5,7) + dept_date.slice(8,10);
    const arrival = arrival_date.slice(2,4) + arrival_date.slice(5,7) + arrival_date.slice(8,10);
    const url = `https://www.skyscanner.nl/transport/vluchten/${cityId}/${cityTo}/${dept}/${arrival}/?adultsv2=1&cabinclass=economy&childrenv2=&ref=home&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`
    return url;
}

// Call the fetchFlights function to start fetching flight data
fetchFlights();
