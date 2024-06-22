# TravelEase - Your Journey, Simplified

## Brief description of the project
Choosing a flight can be a complex and time-consuming task, requiring information from different sources. TravelEase aims to streamline this process, making it more efficient and enjoyable for users. By using flight information sources and providing a user-friendly interface, the application helps users focus more on the excitement of their upcoming trips rather than the logistics. The goal of TravelEase is to simplify the flight planning process with a platform where users can manage their flight itineraries. TravelEase offers two distinct features: planned flights and mysterious flights. Users can plan their flights according to their preferences by choosing specific dates, duration of flight, and destinations. TravelEase aggregates flight data from the most reliable sources, ensuring that users have access to the best options available. For the more adventurous traveler, it introduces the concept of mysterious flights. Users can set their preferences for budget, travel dates, and duration. Based on these preferences, TravelEase will surprise them with a flight itinerary. Additionally, in both features, users can view the weather of their destination.
## Frontend mockup
![alt text](frontend_ss.png)
## Team members
Abdelrahman Emara

Tuana Durmayüksel 

Amina Ahmad
## Installation details
Prerequisites:

Ensure you have all dependencies installed. These are listed in a file named requirements.txt. You can install them using pip install -r requirements.txt.

Starting the servers:

Open a terminal window, navigate to the back-end server directory using cd and run python app.py to start the Flask server.

Accessing the servers:

Once the servers are running, you should be able to access them using the provided port numbers.

## Usage Limits and API Keys
### Skyscanner API
The Skyscanner API used in this project has specific usage limits, typically in terms of requests per month. If you encounter errors related to API limits, it means you've exceeded the allowed number of requests for the current period.

### Weather API (OpenWeatherMap)
This project includes the OpenWeather API which also has usage limits based on the number of requests.

### What to Do If You Reach the Limit:
If you reach the Skyscanner or OpenWeather API limit, please contact us to discuss obtaining a higher limit or alternative arrangements.

## Architecture
    - TravelEase/
    │
    ├── backend/
    │   ├── app.py     
    │   └── users.json                                 
    │
    ├── frontend/
    │   ├── templates/  
    │   │   ├── about-us.html    
    │   │   ├── about-us1.html    
    │   │   ├── error.html       
    │   │   ├── index.html
    │   │   ├── index1.html       
    │   │   ├── login.html
    │   │   ├── profile.html
    │   │   ├── search-normal-flights.html 
    │   │   ├── search-normal-flights1.html 
    │   │   ├── search-mysterious-flights.html 
    │   │   ├── search-mysterious-flights1.html 
    │   │   ├── search-result-mysterious-flight.html 
    │   │   ├── search-result-mysterious-flight1.html 
    │   │   ├── search-result-normal-flight.html      
    │   │   ├── search-result-normal-flight1.html      
    │   │   └── sign-up.html                 
    │   │
    │   └── images/
    │       ├── bg.jpg       
    │       ├── error.png
    │       ├── main_page.gif
    │       └── travel.jpg   
    │
    ├── static/
    │   ├── results-mysterious.js   
    │   ├── results-mysterious1.js    
    │   ├── results-normal.js    
    │   ├── results-normal1.js    
    │   ├── search-mysterious.js   
    │   ├── search-mysterious1.js   
    │   ├── search-normal.js    
    │   └── search-normal1.js   
    │
    ├── requirements.txt
    │
    └── README.md 