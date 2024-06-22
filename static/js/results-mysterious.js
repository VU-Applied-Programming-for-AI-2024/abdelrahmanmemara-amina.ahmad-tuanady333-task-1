const europeanCities = [
    "London",
    "Paris",
    "Berlin",
    "Madrid",
    "Rome",
    "Athens",
    "Amsterdam",
    "Vienna",
    "Zurich",
    "Brussels",
    "Lisbon",
    "Moscow",
    "Stockholm",
    "Copenhagen",
    "Oslo",
    "Helsinki",
    "Dublin",
    "Budapest",
    "Warsaw",
    "Prague",
    "Bucharest",
    "Sofia",
    "Kiev",
    "Belgrade",
    "Zagreb",
    "Skopje",
    "Ljubljana",
    "Vilnius",
    "Tallinn",
    "Riga"
];

function getRandomCity(Cities) {
    var number = Math.floor(Math.random() * Cities.length);
    return Cities[number];
}

var randomCity = getRandomCity(europeanCities);


function parameters() {
    var params = new URLSearchParams(window.location.search);
    return {
        origin: params.get('fromEntityId'),
        min_price: params.get('minimumPrice'),
        max_price:params.get('max_price'),
        dept_date: params.get('depart'),
        return_date: params.get('return_date')
    }
}

var param = parameters();

// Function to show loading alert
function showLoadingAlert() {
    $('#loadingAlert').fadeIn();
}

// Function to hide loading alert
function hideLoadingAlert() {
    $('#loadingAlert').fadeOut();
}

async function weatherAPI(date) {
    const fixed_date = date.slice(6,11);
    const url1 = `http://api.openweathermap.org/geo/1.0/direct?q=${randomCity}&limit=1&appid=76dcae341cd27c351c448e898edca058`;
    const first_response = await fetch(url1);
    const latitude_longitude = await first_response.json();
    const lon = latitude_longitude[0]['lon'];
    const lat = latitude_longitude[0]['lat'];

    const url = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=2023-${fixed_date}&appid=76dcae341cd27c351c448e898edca058`

    const response = await fetch(url);
    const result = await response.json();

    return result;
}

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
    } catch (error) {
        console.error(error)
    }
}

async function generateCard(result, cityId, cityTo, number) {
    const html = document.getElementById('main');
    const city_name = populateAirportList(result);
    const price = flightPrice(result, number);
    const dept_time = departureTime(result, number);
    const arrival_time = arrivalTime(result, number);
    const airport = firstAirport(result);
    const weather = await weatherAPI(param['dept_date']);
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
        </div>`;
    
    html.insertAdjacentHTML('beforeend', markup);
}

let cachedData = null;

async function fetchFlights() {
    try {
        const cityId = await transformCity(param['origin']);
        const cityTo = await transformCity(randomCity);

        const url = `https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=${cityId}&toEntityId=${cityTo}&departDate=${param['dept_date']}&returnDate=${param['return_date']}&stops=direct,1stop`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '76e3d7e612msha9b0c87d96f7361p175e04jsn7f8908586ac3',
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        };

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
            if ((param['min_price'] === null || param['min_price'] === "" || price >= parsePrice(param['min_price'])) &&
                (param['max_price'] === null || param['max_price'] === "" || price <= parsePrice(param['max_price']))) {
                generateCard(result, cityId, cityTo, i);
                flightCount++;
            }
        }

        else if (resultsLength > 10) {
            document.getElementById('count').insertAdjacentHTML('beforeend','<p><strong>Number of Flights Found:</strong> 10 </p>');
            for (let i = 0; i < 10; i++) {
                generateCard(result,cityId,cityTo,i);
            }
        }
        else if (resultsLength === 0) {
            document.getElementById('count').insertAdjacentHTML('beforeend', '<p><strong>Number of Flights Found:</strong> 0 </p>');
            document.getElementById('main').insertAdjacentHTML('beforeend',`<div class="row">
            <div class="col-md-12">
                <div class="flight-card">
                <p> No results found </p>
                </div>
        </div>`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingAlert(); // Hide loading alert on error
    }
}

function flightPrice(data,number) {

    const price = data['data']['itineraries'][number]['price']['formatted'];
    return price;
}

function populateAirportList(data) {
    const airports = data['data']['filterStats']['airports'];
    const markup = ` ${airports[0]['city']} &rarr; <span class="gift">🎁</span>`;
    return markup;
}

function firstAirport(data) {
    const airports = data['data']['filterStats']['airports'][0]['airports'][0]['name'];
    return airports;
}

function departureTime(data, number) {
    const time = data['data']['itineraries'][number]['legs'][0]['departure'].slice(11,16);
    return time;
}

function arrivalTime(data, number) {
    const time = data['data']['itineraries'][number]['legs'][0]['arrival'].slice(11,16);
    return time;
}

function skyscannerLink(cityId, cityTo, dept_date, arrival_date) {
    const dept = dept_date.slice(2,4) + dept_date.slice(5,7) + dept_date.slice(8,10);
    const arrival = arrival_date.slice(2,4) + arrival_date.slice(5,7) + arrival_date.slice(8,10);
    const url = `https://www.skyscanner.nl/transport/vluchten/${cityId}/${cityTo}/${dept}/${arrival}/?adultsv2=1&cabinclass=economy&childrenv2=&ref=home&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`
    return url;
}

fetchFlights();
