

document.getElementById('searchButton').addEventListener('submit', function(event) {
    event.preventDefault();

    const origin = document.getElementById('origin').values;
    const min_price = document.getElementById('min-price').values;
    const max_price = document.getElementById('max-price').values;
    const dept_date = document.getElementById('departure-date').values;
    const ret_date = document.getElementById('return-date').values;

    const query_string = `fromEntityId=${origin}&minimumPrice=${min_price}&max_price=${max_price}&
    depart=${dept_date}&return_date=${ret_date}`;

    window.location.href(`search-result-normal-flight.html?${query_string}`)
})