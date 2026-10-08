// ========================================
// INST630 Tutorial 5 - Array Methods
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // RESTAURANT DATA
    // ========================================

    const restaurants = [
        {
            name: "Milano's Italian Restaurant",
            cuisine: "Italian",
            rating: 4.5,
            priceRange: "$$",
            neighborhood: "College Park"
        },
        {
            name: "Sakura Sushi",
            cuisine: "Japanese",
            rating: 4.2,
            priceRange: "$$$",
            neighborhood: "Downtown"
        },
        {
            name: "Border Café",
            cuisine: "Mexican",
            rating: 4.0,
            priceRange: "$",
            neighborhood: "University District"
        },
        {
            name: "The Brass Elephant",
            cuisine: "American",
            rating: 4.8,
            priceRange: "$$$$",
            neighborhood: "Historic District"
        },
        {
            name: "Pho Corner",
            cuisine: "Vietnamese",
            rating: 4.3,
            priceRange: "$",
            neighborhood: "College Park"
        },
        {
            name: "Tandoor Palace",
            cuisine: "Indian",
            rating: 4.1,
            priceRange: "$$",
            neighborhood: "Downtown"
        },
        {
            name: "Le Petit Bistro",
            cuisine: "French",
            rating: 4.6,
            priceRange: "$$$",
            neighborhood: "Historic District"
        },
        {
            name: "Seoul Kitchen",
            cuisine: "Korean",
            rating: 4.4,
            priceRange: "$$",
            neighborhood: "University District"
        }
    ];


    // ========================================
    // TASK 1: forEach()
    // Display all restaurant names and cuisines
    // ========================================

    const displayButton = document.querySelector('#display-button');
    const restaurantList = document.querySelector('#restaurant-list');

    displayButton.addEventListener('click', () => {

        restaurantList.innerHTML = '';

        restaurants.forEach((restaurant) => {

            restaurantList.innerHTML += `
                <div class="restaurant-item">
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                </div>
            `;

        });

        console.log('Displayed all restaurants using forEach');

    });


    // ========================================
    // TASK 2: filter()
    // Show only restaurants with $ or $$
    // ========================================

    const filterButton = document.querySelector('#filter-button');
    const filteredList = document.querySelector('#filtered-list');

    filterButton.addEventListener('click', () => {

        const affordableRestaurants = restaurants.filter((restaurant) => {
            return restaurant.priceRange === '$' ||
                   restaurant.priceRange === '$$';
        });

        filteredList.innerHTML = '';

        affordableRestaurants.forEach((restaurant) => {

            filteredList.innerHTML += `
                <div class="restaurant-item">
                    <div class="restaurant-name">${restaurant.name}</div>
                    <span class="restaurant-price">${restaurant.priceRange}</span>
                </div>
            `;

        });

        console.log('Showed affordable restaurants using filter');

    });


    // ========================================
    // TASK 3: map()
    // Create a simple list of restaurant names
    // ========================================

    const mapButton = document.querySelector('#map-button');
    const mappedList = document.querySelector('#mapped-list');

    mapButton.addEventListener('click', () => {

        const restaurantNames = restaurants.map((restaurant) => {
            return restaurant.name;
        });

        mappedList.innerHTML = '<ul class="name-list">';

        restaurantNames.forEach((name) => {
            mappedList.innerHTML += `<li>${name}</li>`;
        });

        mappedList.innerHTML += '</ul>';

        console.log('Showed restaurant names using map');

    });


    // ========================================
    // TASK 4: find()
    // Find restaurant with rating 4.8
    // ========================================

    const findButton = document.querySelector('#find-button');
    const foundItem = document.querySelector('#found-item');

    findButton.addEventListener('click', () => {

        const highestRatedRestaurant = restaurants.find((restaurant) => {
            return restaurant.rating === 4.8;
        });

        if (highestRatedRestaurant) {

            foundItem.innerHTML = `
                <div class="found-restaurant">
                    <div class="restaurant-name">
                        ${highestRatedRestaurant.name}
                    </div>
                    <div>
                        ${highestRatedRestaurant.cuisine}
                    </div>
                    <div class="restaurant-rating">
                        Rating: ${highestRatedRestaurant.rating}
                    </div>
                </div>
            `;

        }

        console.log('Found restaurant with rating 4.8 using find');

    });


    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    function demonstrateMethods() {

        console.log('=== Method Demonstrations ===');

        // forEach example
        console.log('forEach example:');

        restaurants.forEach((restaurant) => {
            console.log(
                `- ${restaurant.name} (${restaurant.cuisine})`
            );
        });


        // filter example
        const cheap = restaurants.filter((restaurant) => {
            return restaurant.priceRange === '$' ||
                   restaurant.priceRange === '$$';
        });

        console.log(
            'filter example (affordable restaurants):',
            cheap.length,
            'found'
        );


        // map example
        const names = restaurants.map((restaurant) => {
            return restaurant.name;
        });

        console.log('map example (names):', names);


        // find example
        const best = restaurants.find((restaurant) => {
            return restaurant.rating === 4.8;
        });

        console.log(
            'find example (highest rated):',
            best ? best.name : 'not found'
        );

    }


    function clearAllDisplays() {

        document.querySelector('#restaurant-list').innerHTML =
            '<p class="placeholder">Click button to display all restaurants</p>';

        document.querySelector('#filtered-list').innerHTML =
            '<p class="placeholder">Click button to show only affordable restaurants</p>';

        document.querySelector('#mapped-list').innerHTML =
            '<p class="placeholder">Click button to show just the restaurant names</p>';

        document.querySelector('#found-item').innerHTML =
            '<p class="placeholder">Click button to find the highest rated restaurant</p>';

        console.log('All displays cleared');

    }

});