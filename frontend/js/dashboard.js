// Dummy data for demonstration

{


    const recent_games = [
        { date_time: '2024-10-02T17:00:00Z', end_time: '2024-10-02T17:04:30Z', score: [5, 0] },
        { date_time: '2024-10-02T17:05:00Z', end_time: '2024-10-02T17:08:10Z', score: [4, 5] },
        { date_time: '2024-10-02T17:09:00Z', end_time: '2024-10-02T17:14:50Z', score: [3, 5] },
        { date_time: '2024-10-02T17:15:10Z', end_time: '2024-10-02T17:18:00Z', score: [5, 4] },
        { date_time: '2024-10-02T17:19:00Z', end_time: '2024-10-02T17:22:45Z', score: [5, 4] },
    ]



// Fetch user stats and game results from the API
async function fetchDashboardData() {
    removeAlert(); //check
    try {
        const response = await fetch("https://localhost/api/player/stats/", {
            headers: {
                'Authorization': `Token ${localStorage.getItem("token")}`,
                'Accept': 'application/json',
            },
            method: 'GET',
        });

        let data;
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            console.log("Error: " + JSON.stringify(data));
            throw new Error(JSON.stringify(data.detail) || 'An error occurred');
        }
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
function updateDashboard(data) {
    // Update player stats 
    let victoriesElement = document.getElementById('victories');
    let lossesElement = document.getElementById('losses');

    if (victoriesElement) {
        victoriesElement.innerText = data.victories;
    }

    if (lossesElement) {
        lossesElement.innerText = data.losses;
    }

    // Prepare game result data for the chart
    const gameResults = recent_games;
    const labels = gameResults.map(result => {
        const date = new Date(result.date_time);
        return date.toLocaleDateString('en-GB', { timeZone: 'UTC' }) + ' ' + date.toLocaleTimeString('en-GB', { timeZone: 'UTC' });
    });
    const playerScores = gameResults.map(result => result.score[0]);
    const opponentScores = gameResults.map(result => result.score[1]);

    // Render the charts with actual data
    renderCharts(labels, playerScores, opponentScores, data.victories, data.losses, gameResults);
}

// This function contains all the chart rendering code
function renderCharts(labels, playerScores, opponentScores, victories, losses, gameResults) {
    // Line chart for player and opponent scores
    const ctx = document.getElementById('gameResultsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Player',
                    data: playerScores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 4
                },
                {
                    label: 'Opponent',
                    data: opponentScores,
                    borderColor: 'rgba(255, 99, 132, 1)',  // Different color for opponent's scores
                    borderWidth: 4
                }
            ]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 16  // Increase font size of the x-axis labels
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,  // Ensure the scale increments by whole numbers
                        callback: function(value) {
                            return Number.isInteger(value) ? value : '';  // Display only whole numbers
                        },
                        font: {
                            size: 16  // Increase font size of the y-axis labels
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18  // Increase font size of the legend (Player and Opponent)
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 16  // Increase font size of tooltip titles
                    },
                    bodyFont: {
                        size: 16  // Increase font size of tooltip text
                    }
                }
            }
        }
    });

    // Pie chart for victories and losses
    const ctxPie = document.getElementById('victoryLossChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Victories', 'Losses'],
            datasets: [{
                data: [victories, losses],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for victories
                    'rgba(255, 99, 132, 0.6)'  // Color for losses
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 18  // Increase font size of the legend (Victories and Losses)
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 16  // Increase font size of tooltip titles
                    },
                    bodyFont: {
                        size: 16  // Increase font size of tooltip text
                    }
                }
            }
        }
    });

    // Additional chart logic for game durations, intensity, etc., remains the same
}

// Call the fetchDashboardData function to get the data and render the charts
fetchDashboardData();

}
//    })
//    .catch(error => console.error('Error fetching dashboard data:', error));}