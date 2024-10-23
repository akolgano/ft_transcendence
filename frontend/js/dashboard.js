
// Fetch user stats and game results from the API
async function fetchDashboardData() {
    removeAlert(); //check
    try {
        // Make a GET request to the API to fetch player stats
        const response = await fetch(`https://localhost/api/player/stats/${JSON.parse(localStorage.getItem("user")).username}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem("token")}`, // Use the stored token for authentication
                'Accept': 'application/json', // Expect a JSON response
            },
            method: 'GET',
        });

        let data; // Variable to hold the response data
        const contentType = response.headers.get('Content-Type');
        // Check if the response is in JSON format
        if (contentType && contentType.includes('application/json')) {
            data = await response.json(); // Parse JSON data
        } else {
            data = await response.text(); // If not JSON, just get plain text
        }

        // If the request failed (response not ok)
        if (!response.ok) {
            console.log("Error: " + JSON.stringify(data));
            throw new Error(JSON.stringify(data.detail) || 'An error occurred');
        }
        // If data is received successfully
        if (data)
        {
            console.log("Dashboard data: " + JSON.stringify(data)); // dash log
            updateDashboard(data); // Pass data to updateDashboard function
        }
        else
        {
            removeAlert();
            displayAlert("dash.error-load", "danger"); // check
            console.log(data.message);
        }
    } catch (error) {
        removeAlert();
        displayAlert("dash.error-load", "danger"); // check
        console.log(error.message)
    }
}

// Update the dashboard with the actual data from the API
// Update the dashboard with the actual data from the API
function updateDashboard(data) {
    // Check if game results are present
    const gameResults = data.game_results; // This is already fetching gameResults

    if (!gameResults || gameResults.length === 0) {
        // Hide the dashboard content and show the "No data" message
        document.getElementById('dashboardContent').classList.add('d-none');
        document.getElementById('noDataMessage').classList.remove('d-none');
    } else {
        // Show the dashboard content and hide the "No data" message
        document.getElementById('dashboardContent').classList.remove('d-none');
        document.getElementById('noDataMessage').classList.add('d-none');
    }

    // Proceed to update player stats and render charts
    let victoriesElement = document.getElementById('victories');
    let lossesElement = document.getElementById('losses');

    if (victoriesElement) {
        victoriesElement.innerText = data.victories;
    }

    if (lossesElement) {
        lossesElement.innerText = data.losses;
    }

    // Prepare game result data for the chart
    const labels = gameResults.map(result => {
        const date = new Date(result.date_time);
        return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Singapore' }) + ' ' + date.toLocaleTimeString('en-GB', { timeZone: 'Asia/Singapore' });
    });
    const playerScores = gameResults.map(result => result.score[0]);
    const opponentScores = gameResults.map(result => result.score[1]);

    // Sort game results by date in ascending order
    const sortedIndices = labels
        .map((_, index) => index) // Create an array of indices
        .sort((a, b) => new Date(gameResults[a].date_time) - new Date(gameResults[b].date_time)); // Sort based on date

    // Re-order the arrays based on sorted indices
    const sortedLabels = sortedIndices.map(index => labels[index]);
    const sortedPlayerScores = sortedIndices.map(index => playerScores[index]);
    const sortedOpponentScores = sortedIndices.map(index => opponentScores[index]);

    // Render the charts with sorted data
    renderCharts(sortedLabels, sortedPlayerScores, sortedOpponentScores, data.victories, data.losses, gameResults);
}


// This function contains all the chart rendering code
function renderCharts(labels, playerScores, opponentScores, victories, losses, gameResults) {
    renderLineChart(labels, playerScores, opponentScores);
    renderPieChart('victoryLossChart', ['Victories', 'Losses'], [victories, losses], [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
    ]);
    renderBarChart(labels, gameResults);
    renderIntensityChart(labels, gameResults);
    renderMarginPieChart(gameResults);
    
    
}

// Function to render the line chart (Player vs. Opponent scores)
function renderLineChart(labels, playerScores, opponentScores) {
    const chartContainer = document.getElementById('gameResultsChart').parentNode;
    const ctx = document.getElementById('gameResultsChart').getContext('2d');
    
    // Limit the data to the most recent 20 entries
    const limit = 20;
    const recentLabels = labels.slice(-limit);
    const recentPlayerScores = playerScores.slice(-limit);
    const recentOpponentScores = opponentScores.slice(-limit);

    // Check if there is data
    if (!recentLabels || recentLabels.length === 0 || !recentPlayerScores || recentPlayerScores.length === 0 || !opponentScores || opponentScores.length === 0) {
        // Hide the chart canvas
        document.getElementById('gameResultsChart').style.display = 'none';

        // Display the "No data" message
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'No game results available.';
        noDataMessage.classList.add('text-center', 'mt-4', 'text-muted'); // Bootstrap classes for styling
        chartContainer.appendChild(noDataMessage);

        return; // Exit the function, don't render the chart
    }

    // Show the chart canvas if data exists
    document.getElementById('gameResultsChart').style.display = 'block';

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: recentLabels,
            datasets: [
                {
                    data: recentPlayerScores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointRadius: 3,  // Show a small dot for each point
                    pointHoverRadius: 5  // Increase hover size for better visibility
                },
                {
                    data: recentOpponentScores,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointRadius: 3,  // Show a small dot for each point
                    pointHoverRadius: 5  // Increase hover size for better visibility
                }
            ]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        font: { size: 16 }
                    },
                    title: {
                        display: false, // Hide 'Date / Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : '',
                        font: { size: 16 }
                    },
                    title: {
                        display: false, // Hide 'Points'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false, // Hide legend
                },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            },
            elements: {
                point: {
                    radius: 3 // Remove the default point circles from the chart lines
                }
            }
        }
    });
}


// Function to render a pie chart (Victories and Losses or Margins)
function renderPieChart(chartId, labels, data, backgroundColors) {
    const chartContainer = document.getElementById(chartId).parentNode;
    const ctxPie = document.getElementById(chartId).getContext('2d');
    
    // Check if both victories and losses are 0
    if (!data || data.length === 0 || (data[0] === 0 && data[1] === 0)) {
        // Hide the pie chart canvas
        document.getElementById(chartId).style.display = 'none';
        return; // Exit the function, don't render the pie chart
    }

    // Show the pie chart canvas if data exists
    document.getElementById(chartId).style.display = 'block';

    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // This will remove the legend
                },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            }
        }
    });
}


// Function to render the bar chart for game durations
function renderBarChart(labels, gameResults) {
    const chartContainer = document.getElementById('gameDurationChart').parentNode;
    const ctxBar = document.getElementById('gameDurationChart').getContext('2d');

    // Check if there is data
    if (!gameResults || gameResults.length === 0) {
        // Hide the bar chart canvas
        document.getElementById('gameDurationChart').style.display = 'none';
        return; // Exit the function, don't render the bar chart
    }

    const gameDurations = gameResults.map(result => {
        const durationParts = result.game_duration.split(':'); // Split the "HH:MM:SS" format
        const minutes = parseInt(durationParts[1]); // Extract the minutes
        const seconds = parseInt(durationParts[2]); // Extract the seconds
        return { minutes, seconds }; // Return an object with minutes and seconds
    });

    // Reverse the gameDurations array to match the correct order
    const reversedGameDurations = gameDurations.reverse();

    // Limit the data to the most recent 20 entries
    const limit = 20;
    const recentDurations = reversedGameDurations.slice(-limit);
    const recentLabels = labels.slice(-limit);

    // Show the bar chart canvas if data exists
    document.getElementById('gameDurationChart').style.display = 'block';

    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: recentLabels,
            datasets: [{
                label: 'Game Duration (minutes)',
                data: recentDurations.map(d => d.minutes + (d.seconds / 60)), // Convert to fractional minutes for bar heights
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: { font: { size: 16 } },
                    title: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : '',
                        font: { size: 16 }
                    },
                    title: {
                        display: false,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const duration = recentDurations[tooltipItem.dataIndex];
                            const minutes = duration.minutes;
                            const seconds = duration.seconds;
                            return `Game Duration (MM:SS): ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                        }
                    },
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            }
        }
    });
}


// Function to render the bar chart for game intensity (Scores per minute)
function renderIntensityChart(labels, gameResults) {
    const chartContainer = document.getElementById('gameIntensityChart').parentNode;
    const ctxIntensity = document.getElementById('gameIntensityChart').getContext('2d');

    // Check if there is data
    if (!gameResults || gameResults.length === 0) {
        // Hide the intensity chart canvas
        document.getElementById('gameIntensityChart').style.display = 'none';
        return; // Exit the function, don't render the intensity chart
    }

    const gameIntensity = gameResults.map(result => {
        const durationParts = result.game_duration.split(':'); // Split the "HH:MM:SS" format
        const minutes = parseInt(durationParts[1]); // Extract the minutes
        const seconds = parseInt(durationParts[2]); // Extract the seconds
        const duration = minutes + (seconds / 60); // Convert duration to minutes (fractional)
        const totalScore = result.score[0] + result.score[1]; // Calculate total score
        return totalScore / duration; // Calculate intensity (points per minute)
    });

    // Reverse the gameIntensity array to match the labels
    const reversedGameIntensity = gameIntensity.reverse();

    // Limit the data to the most recent 20 entries
    const limit = 20;
    const recentLabels = labels.slice(-limit); // Last 20 labels
    const recentGameIntensity = reversedGameIntensity.slice(-limit); // Last 20 intensity values

    // Show the intensity chart canvas if data exists
    document.getElementById('gameIntensityChart').style.display = 'block';

    new Chart(ctxIntensity, {
        type: 'bar',
        data: {
            labels: recentLabels,
            datasets: [{
                label: 'Game Intensity (Points per Minute)',
                data: recentGameIntensity,
                backgroundColor: recentGameIntensity.map(value => {
                    const intensity = Math.min(value / Math.max(...recentGameIntensity), 1);
                    return `rgba(255, 99, 132, ${intensity})`;
                }),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: { font: { size: 16 } },
                    title: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : '',
                        font: { size: 16 }
                    },
                    title: {
                        display: false,
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 },
                    callbacks: {
                        label: function (context) {
                            const game = gameResults[context.dataIndex];
                            return `Intensity: ${context.raw.toFixed(2)} scores/min`;
                        }
                    }
                }
            }
        }
    });
}

// Function to render the pie chart for game margins
function renderMarginPieChart(gameResults) {
    const gameMargins = gameResults.map(result => Math.abs(result.score[0] - result.score[1]));

    const marginCategories = { "Close Games (1)": 0, "Moderate Games (2-3)": 0, "Large Margins (4+)": 0 };
    gameMargins.forEach(margin => {
        if (margin <= 1) marginCategories["Close Games (1)"]++;
        else if (margin <= 3) marginCategories["Moderate Games (2-3)"]++;
        else marginCategories["Large Margins (4+)"]++;
    });

    renderPieChart('gameMarginChart', Object.keys(marginCategories), Object.values(marginCategories), [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
    ]);
}


// Call the fetchDashboardData function to get the data and render the charts
fetchDashboardData();

//}
