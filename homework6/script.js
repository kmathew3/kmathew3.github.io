// ============================================
// INST630 HOMEWORK 6: ASYNC/AWAIT AND APIs
// ============================================

let restaurants = [];

document.addEventListener('DOMContentLoaded', function () {
    const loadButton = document.querySelector('#load-data-button');
    const displayButton = document.querySelector('#display-button');
    const filterButton = document.querySelector('#filter-button');
    const mapButton = document.querySelector('#map-button');
    const errorButton = document.querySelector('#error-button');

    // Main workflow: load JSON, handle states, and enable the interface.
    async function loadData() {
        loadButton.disabled = true;
        toggleMethodButtons(false);
        updateStatus('loading', 'Loading restaurant data...');

        try {
            const response = await fetch('restaurants.json');

            // fetch() only rejects automatically for some network errors,
            // so check response.ok to catch HTTP errors such as 404.
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('The restaurant data is not in the expected format.');
            }

            restaurants = data;
            updateStatus('success', `Successfully loaded ${restaurants.length} restaurants.`);
            toggleMethodButtons(restaurants.length > 0);
            clearMethodResults();
        } catch (error) {
            restaurants = [];
            toggleMethodButtons(false);
            updateStatus(
                'error',
                'Unable to load restaurant data. Check that restaurants.json is in the same folder and try again.'
            );
            console.error('Restaurant data loading failed:', error);
        } finally {
            loadButton.disabled = false;
        }
    }

    loadButton.addEventListener('click', loadData);

    // Method 1: forEach() displays every restaurant.
    displayButton.addEventListener('click', function () {
        const output = document.querySelector('#restaurant-list');

        if (!hasRestaurantData(output)) return;
        output.replaceChildren();

        restaurants.forEach(function (restaurant) {
            const item = document.createElement('article');
            item.className = 'restaurant-item';

            const name = document.createElement('h3');
            name.textContent = restaurant.name;

            const details = document.createElement('p');
            details.textContent = `${restaurant.cuisine} · Rating: ${restaurant.rating} · Price: ${restaurant.priceRange}`;

            const neighborhood = document.createElement('p');
            neighborhood.textContent = `Neighborhood: ${restaurant.neighborhood}`;

            item.append(name, details, neighborhood);
            output.appendChild(item);
        });
    });

    // Method 2: filter() returns only restaurants priced $.
    filterButton.addEventListener('click', function () {
        const output = document.querySelector('#filtered-list');

        if (!hasRestaurantData(output)) return;

        const cheapRestaurants = restaurants.filter(function (restaurant) {
            return restaurant.priceRange === '$';
        });

        output.replaceChildren();

        if (cheapRestaurants.length === 0) {
            output.appendChild(makeMessage('No restaurants were found in the $ price range.', 'placeholder'));
            return;
        }

        cheapRestaurants.forEach(function (restaurant) {
            const item = document.createElement('article');
            item.className = 'restaurant-item';

            const name = document.createElement('h3');
            name.textContent = restaurant.name;

            const details = document.createElement('p');
            details.textContent = `${restaurant.cuisine} · Price: ${restaurant.priceRange} · Rating: ${restaurant.rating}`;

            item.append(name, details);
            output.appendChild(item);
        });
    });

    // Method 3: map() transforms restaurant objects into an array of names.
    mapButton.addEventListener('click', function () {
        const output = document.querySelector('#mapped-list');

        if (!hasRestaurantData(output)) return;

        const names = restaurants.map(function (restaurant) {
            return restaurant.name;
        });

        const list = document.createElement('ul');
        list.className = 'name-list';

        names.forEach(function (name) {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            list.appendChild(listItem);
        });

        output.replaceChildren(list);
    });

    // Error demo: intentionally fetch a nonexistent file.
    errorButton.addEventListener('click', async function () {
        const output = document.querySelector('#error-display');
        errorButton.disabled = true;
        output.replaceChildren(makeMessage('Trying to load from a bad URL...', 'placeholder'));

        try {
            const response = await fetch('nonexistent-file.json');

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            await response.json();
            output.replaceChildren(makeMessage('The request unexpectedly succeeded.', 'placeholder'));
        } catch (error) {
            const message = makeMessage(
                'The request failed, as expected. The file could not be found. You can retry this test or use “Load Restaurant Data” to load the real data.',
                'error-message'
            );

            const retryButton = document.createElement('button');
            retryButton.type = 'button';
            retryButton.className = 'method-button retry-button';
            retryButton.textContent = 'Retry Error Test';
            retryButton.addEventListener('click', function () {
                errorButton.click();
            });

            output.replaceChildren(message, retryButton);
            console.error('Demonstrated error:', error);
        } finally {
            errorButton.disabled = false;
        }
    });
});

function toggleMethodButtons(enabled) {
    ['#display-button', '#filter-button', '#map-button'].forEach(function (selector) {
        const button = document.querySelector(selector);
        if (button) button.disabled = !enabled;
    });
}

function updateStatus(state, message) {
    const statusDisplay = document.querySelector('#loading-status');
    const statusMessage = statusDisplay.querySelector('.status-message');

    statusDisplay.classList.remove('loading', 'success', 'error');
    if (state !== 'ready') statusDisplay.classList.add(state);

    statusMessage.textContent = message;
}

function clearMethodResults() {
    document.querySelector('#restaurant-list').replaceChildren(
        makeMessage('Click to display all restaurants.', 'placeholder')
    );
    document.querySelector('#filtered-list').replaceChildren(
        makeMessage('Click to show affordable restaurants.', 'placeholder')
    );
    document.querySelector('#mapped-list').replaceChildren(
        makeMessage('Click to show restaurant names.', 'placeholder')
    );
}

function makeMessage(message, className) {
    const paragraph = document.createElement('p');
    paragraph.className = className;
    paragraph.textContent = message;
    return paragraph;
}

function hasRestaurantData(output) {
    if (restaurants.length === 0) {
        output.replaceChildren(
            makeMessage('No data loaded yet. Please load the data first.', 'placeholder')
        );
        return false;
    }
    return true;
}

// Optional browser-console helpers for testing.
async function manualLoadData() {
    const button = document.querySelector('#load-data-button');
    if (button) button.click();
}

function checkDataStatus() {
    console.log('Restaurants loaded:', restaurants.length);
    console.log('Restaurant names:', restaurants.map(function (restaurant) {
        return restaurant.name;
    }));
}

function resetTutorial() {
    restaurants = [];
    toggleMethodButtons(false);
    updateStatus('ready', 'Ready to load data');

    const loadButton = document.querySelector('#load-data-button');
    if (loadButton) loadButton.disabled = false;

    clearMethodResults();
    document.querySelector('#error-display').replaceChildren(
        makeMessage('Click to see error handling in action.', 'placeholder')
    );
    console.log('Tutorial reset.');
}
