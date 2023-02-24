# LightBnB
A simple, multi-page AirBnB clone which uses server-side JavaScript to display information from queries to web pages via SQL queries. This project is part of the Lighthouse Labs Web Development Bootcamp program, and the initial set up code can be found [here] (https://github.com/lighthouse-labs/LightBnB_WebApp). 

# Project Outcomes

In this project, I learned how to:

- Design the database and create an ERD for the tables.
- Create the database and the tables using the ERD.
- Add data to the database to make testing queries easier.
- Write queries.
- Connect the database to a JavaScript application in order to interact with the data from a web page.

# Project Features

A user can: 
- create an account and then login and logout
- Search properties using a variety of dynamic search parameters
- Create a new listing
- View thier own listings and reservations

# Project Structure
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── apiRoutes.js
  ├── database.js
  ├── json
  ├── server.js
  ├── userRoutes.js
  └── db
      └──db.js
      
# Installation Instructions

1. Clone the project into your terminal and install dependencies using `npm install`. 
2. Start the web server in LightBnB_WebApp-master using the `npm run local` command. 
3. Go to localhost:3000 in your browser or set your own host using your own environment variables. 

# Project Screenshots 

![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")
![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")
![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")
![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")

# Entity Relationship Diagram 

Check out the project ERD [here](/relative/path/to/img.jpg?raw=true "Optional Title")
