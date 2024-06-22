
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

var param = parameters();

console.log(param);


async function weatherAPI() {
    const url = `http://api.weatherapi.com/v1/current.json?key=ea09ccb6110d4c7f959165058242106&q=paris`

    const response = await fetch(url);
    console.log(response);
}

weatherAPI();

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

function generateCard(result, number) {
    const html = docuemnt.getElementById('main');
    const city_name = populateAirportList(result,airport);
    const price = flightPrice(result,number);
    const dept_time = departureTime(result,number);
    const arrival_time = arrivalTime(result,number);
    const airport = firstAirport(result);
    const markup = `<div class="row">
            <div class="col-md-12">
                <div class="flight-card">
                    <h2 class="text-dark" id="firstairportList">${city_name}</h2>
                    <div class="flight-info">
                        <p id="firstAirport"><strong>Departure: </strong> ${airport} </p>
                        <p id="firstDeperature">${dept_time}</p>
                        <p id="firstArrival"> ${arrival_time}</p>
                        <p id="firstPrice"><strong>Price: </strong> ${price}</p>
                        <p><strong>Weather at Arrival:</strong> Partly Cloudy</p>
                        <p><strong>Temperature at Arrival:</strong> 75°F</p>
                        <p><strong>Wind at Arrival:</strong> 7 mph</p>
                        <p><strong>Humidity at Arrival:</strong> 50%</p>
                    </div>
                    <button class="btn btn-secondary">Book Now</button>
                </div>
        </div>`;
    
        html.insertAdjacentHTML('beforeend',markup);
}






let cachedData = null; // Variable to store cached API response data

async function fetchFlights() {
    try {
        // Get the cityId asynchronously
        const cityId = await transformCity(param['origin']);
        const cityTo = await transformCity(param['end'])

        // Construct the URL using the cityId
        const url = `https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=${cityId}&toEntityId=${cityTo}&departDate=${param['dept_date']}&returnDate=${param['return_date']}&stops=direct`;
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

            generateCard(result,i);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function flightPrice(data,number) {
    const price = data['data']['itineraries'][number]['price']['formatted'];

    return price;
}

function populateAirportList(data) {

    const airports = data['data']['filterStats']['airports'];

    const markup = `${airports[0]['city']} to ${airports[1]['city']}`
    return markup;
}

function firstAirport(data) {

    const airports = data['data']['filterStats']['airports'];

    return airports;
}

function departureTime(data,number) {
    const time = data['data']['itineraries'][number]['legs'][0]['departure'].slice(11,16);

    return time;
}

function arrivalTime(data,number) {
    const time = data['data']['itineraries'][number]['legs'][0]['arrival'].slice(11,16);

    return time;
}



// Call the async function
fetchFlights();
