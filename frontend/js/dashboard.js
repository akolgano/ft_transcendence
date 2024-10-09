// Dummy data for demonstration

{


    const recent_games = [
        { date_time: '2024-10-02T17:00:00Z', end_time: '2024-10-02T17:04:30Z', score: [5, 0] },
        { date_time: '2024-10-02T17:05:00Z', end_time: '2024-10-02T17:08:10Z', score: [4, 5] },
        { date_time: '2024-10-02T17:09:00Z', end_time: '2024-10-02T17:14:50Z', score: [3, 5] },
        { date_time: '2024-10-02T17:15:10Z', end_time: '2024-10-02T17:18:00Z', score: [5, 4] },
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

    // Prepare game result data for the game duration bar chart
    const gameDurations = gameResults.map((result) => {
        const startTime = new Date(result.date_time);
        const endTime = new Date(result.end_time);
        return (endTime - startTime) / 60000;  // Duration in minutes
    });

    // Render the bar chart for game durations
    const ctxBar = document.getElementById('gameDurationChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,  // Use all labels as we now have a duration for each game
            datasets: [{
                label: 'Game Duration (minutes)',
                data: gameDurations,  // Duration for each game
                backgroundColor: 'rgba(153, 102, 255, 0.6)',  // Color for the bars
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2
            }]
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
                            size: 18  // Increase font size of the legend (Game Duration)
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const game = data.recent_games[context.dataIndex];
                            const startTime = new Date(game.date_time).toLocaleTimeString('en-GB', { timeZone: 'UTC' });
                            const endTime = new Date(game.end_time).toLocaleTimeString('en-GB', { timeZone: 'UTC' });
                            return `Duration: ${context.raw} mins (Start: ${startTime}, End: ${endTime})`;
                        }
                    },
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


    // Prepare game intensity data (scores per minute)
    const gameIntensity = gameResults.map((result) => {
        const startTime = new Date(result.date_time);
        const endTime = new Date(result.end_time);
        const duration = (endTime - startTime) / 60000;  // Duration in minutes
        const totalScore = result.score[0] + result.score[1];  // Total score for both player and opponent
        return totalScore / duration;  // Scores per minute (intensity)
    });

    // Render the heatmap-style bar chart for game intensity
    const ctxIntensity = document.getElementById('gameIntensityChart').getContext('2d');
    new Chart(ctxIntensity, {
        type: 'bar',
        data: {
            labels: labels,  // Use the same labels for game dates
            datasets: [{
                label: 'Game Intensity (Scores per Minute)',
                data: gameIntensity,  // Scores per minute for each game
                backgroundColor: gameIntensity.map(value => {
                    // Generate color based on intensity: more intense games are darker
                    const intensity = Math.min(value / Math.max(...gameIntensity), 1);  // Normalize intensity between 0 and 1
                    return `rgba(255, 99, 132, ${intensity})`;  // Red gradient (change color if needed)
                }),
                borderColor: 'rgba(255, 99, 132, 1)',  // Border color for each bar
                borderWidth: 2
            }]
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
                            size: 18  // Increase font size of the legend (Game Intensity)
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const game = data.recent_games[context.dataIndex];
                            const startTime = new Date(game.date_time).toLocaleTimeString('en-GB', { timeZone: 'UTC' });
                            const endTime = new Date(game.end_time).toLocaleTimeString('en-GB', { timeZone: 'UTC' });
                            return `Intensity: ${context.raw.toFixed(2)} scores/min (Start: ${startTime}, End: ${endTime})`;
                        }
                    },
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

    // Prepare data for game margins
    const gameMargins = gameResults.map(result => Math.abs(result.score[0] - result.score[1]));

    // Group margins into categories
    const marginCategories = {
        "Close Games (1)": 0,
        "Moderate Games (2-3)": 0,
        "Large Margins (4+)": 0
    };

    // Classify each game based on its margin
    gameMargins.forEach(margin => {
        if (margin <= 1) {
            marginCategories["Close Games (1)"]++;
        } else if (margin <= 3) {
            marginCategories["Moderate Games (2-3)"]++;
        } else {
            marginCategories["Large Margins (4+)"]++;
        }
    });

    // Data for pie chart
    const marginLabels = Object.keys(marginCategories);
    const marginData = Object.values(marginCategories);

    // Render the pie chart for game margins
    const ctxMargin = document.getElementById('gameMarginChart').getContext('2d');
    new Chart(ctxMargin, {
        type: 'pie',
        data: {
            labels: marginLabels,  // Label categories
            datasets: [{
                data: marginData,  // Data values for each category
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)', // Blue for close games
                    'rgba(255, 205, 86, 0.6)', // Yellow for moderate games
                    'rgba(255, 99, 132, 0.6)'  // Red for large margins
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
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
                            size: 18  // Increase font size of the legend (Game Margins)
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
}

// Call the fetchDashboardData function to get the data and render the charts
fetchDashboardData();

}
//    })
//    .catch(error => console.error('Error fetching dashboard data:', error));}