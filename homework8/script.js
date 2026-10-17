// ============================================
// TUTORIAL 8: STUDENT WORK FILE
// Complete the three library integration examples
// ============================================

import {
    handleAnimationError,
    getRestaurantCoordinates,
    handleMapError,
    handleChartError,
    createRestaurantCards,
    clearExistingMap,
    restaurants,
    clickToLoad
 } from './tutorial-support.js';

// Global variables for your library instances
let myChart = null;
let myMap = null;

// Wait for page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tutorial 8: Student work file ready!');
    
    // Set up your event listeners
    // Set up event listeners - note the arrow function to pass the button
    document.querySelector('#load-data-button').addEventListener('click', function(event) {
        clickToLoad(event.target); // Pass the button that was clicked
    });
    document.querySelector('#chart-button').addEventListener('click', createMyChart);
    document.querySelector('#map-button').addEventListener('click', createMyMap);
    document.querySelector('#animation-button').addEventListener('click', animateMyCards);
});

// ============================================
// EXAMPLE 1: CHART.JS - YOU COMPLETE THIS
// ============================================

function createMyChart() {
    if (typeof Chart === 'undefined') {
        alert('Chart.js not available. Check console.');
        return;
    }
    if (restaurants.length === 0) {
        alert('No data loaded. Click "Load Data" first.');
        return;
    }

    const cuisineCounts = {};
    restaurants.forEach(function(restaurant) {
        const cuisine = restaurant.cuisine || 'Other';
        cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
    });
    const chartLabels = Object.keys(cuisineCounts);
    const chartData = Object.values(cuisineCounts);

    try {
        const canvas = document.querySelector('#restaurant-chart');
        const ctx = canvas.getContext('2d');
        if (myChart) {
            myChart.destroy();
            myChart = null;
        }

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Number of restaurants',
                    data: chartData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(100, 116, 139, 0.6)',
                        'rgba(232, 117, 50, 0.6)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Restaurant Distribution by Cuisine'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + (context.parsed.y === 1 ? ' restaurant' : ' restaurants');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, stepSize: 1 },
                        title: { display: true, text: 'Number of restaurants' }
                    },
                    x: {
                        title: { display: true, text: 'Cuisine' }
                    }
                }
            }
        });
        console.log('Chart created successfully!', { labels: chartLabels, data: chartData });
    } catch (error) {
        handleChartError(error);
    }
}

// ============================================
// EXAMPLE 2: LEAFLET.JS - YOU COMPLETE THIS
// ============================================

function createMyMap() {
    if (typeof L === 'undefined') {
        alert('Leaflet.js not available. Check console.');
        return;
    }
    if (restaurants.length === 0) {
        alert('No data loaded. Click "Load Data" first.');
        return;
    }

    try {
        clearExistingMap();
        const mapContainer = document.querySelector('#restaurant-map');
        mapContainer.textContent = '';
        myMap = L.map('restaurant-map').setView([38.9897, -76.9378], 12);
        window.myMap = myMap;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(myMap);

        const markerCoordinates = [];
        restaurants.forEach(function(restaurant, index) {
            const coords = getRestaurantCoordinates(restaurant, index);
            markerCoordinates.push(coords);

            const popupContent = `
                <strong>${restaurant.name || 'Unknown restaurant'}</strong>
                <p>Cuisine: ${restaurant.cuisine || 'Unknown'}<br>
                Rating: ${restaurant.rating ?? 'N/A'}/5<br>
                Neighborhood: ${restaurant.neighborhood || 'Unknown'}</p>
            `;
            L.marker(coords).addTo(myMap).bindPopup(popupContent);
        });

        if (markerCoordinates.length > 1) {
            myMap.fitBounds(markerCoordinates, { padding: [24, 24], maxZoom: 13 });
        }
        window.setTimeout(function() {
            if (myMap) myMap.invalidateSize();
        }, 100);
        console.log('Map created successfully!');
    } catch (error) {
        handleMapError(error);
    }
}

// ============================================
// EXAMPLE 3: GSAP - YOU COMPLETE THIS
// ============================================

function animateMyCards() {
    if (typeof gsap === 'undefined') {
        alert('GSAP not available. Check console.');
        return;
    }
    if (restaurants.length === 0) {
        alert('No data loaded. Click "Load Data" first.');
        return;
    }

    try {
        createRestaurantCards();
        gsap.fromTo('.restaurant-card',
            { opacity: 0, scale: 0.94, y: 24 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.12,
                ease: 'power2.out',
                clearProps: 'transform'
            }
        );
        console.log('Animation created successfully!');
    } catch (error) {
        handleAnimationError(error);
    }
}

// ============================================
// DEBUGGING HELPERS (for your console)
// ============================================

function testMyWork() {
    console.log('Testing your implementations...');
    
    if (restaurants.length > 0) {
        console.log('Data loaded:', restaurants.length, 'restaurants');
        
        // Test each function
        console.log('Testing Chart.js...');
        createMyChart();
        
        setTimeout(() => {
            console.log('Testing Leaflet.js...');
            createMyMap();
            
            setTimeout(() => {
                console.log('Testing GSAP...');
                animateMyCards();
            }, 1000);
        }, 1000);
    } else {
        console.log('No restaurant data loaded. Make sure tutorial-support.js is included.');
    }
}

// Call testMyWork() in the console to test all your implementations
