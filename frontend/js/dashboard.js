// Dummy data for demonstration

{


    const recent_games = [
    { date_time: '2024-10-02T17:00:00Z', end_time: '2024-10-02T17:04:30Z', score: [5, 1], progression: [[1, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]] },
    { date_time: '2024-10-02T17:05:00Z', end_time: '2024-10-02T17:08:10Z', score: [4, 5], progression: [[1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]] },
    { date_time: '2024-10-02T17:09:00Z', end_time: '2024-10-02T17:14:50Z', score: [3, 5], progression: [[0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [3, 5]] },
    { date_time: '2024-10-02T17:15:10Z', end_time: '2024-10-02T17:18:00Z', score: [5, 4], progression: [[1, 0], [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [4, 3], [4, 4], [5, 4]] }
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
    renderLineChart(labels, playerScores, opponentScores);
    renderPieChart('victoryLossChart', ['Victories', 'Losses'], [victories, losses], [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
    ]);
    renderBarChart(labels, gameResults);
    renderIntensityChart(labels, gameResults);
    renderMarginPieChart(gameResults);
    
    // Remove any previous score progression charts
    const progressionsContainer = document.getElementById('progressionsContainer');
    progressionsContainer.innerHTML = '';

    gameResults.forEach((gameResult, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('game-list-item', 'mb-2');
        listItem.textContent = `Game ${index + 1}`;
        
        // Add hover event listener to open modal and render chart
        listItem.addEventListener('mouseenter', () => {
            openGameProgressionModal(gameResult.progression, index + 1);
        });
        
        progressionsContainer.appendChild(listItem);
    });
}

// Function to render the line chart (Player vs. Opponent scores)
function renderLineChart(labels, playerScores, opponentScores) {
    const ctx = document.getElementById('gameResultsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'You',
                    data: playerScores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointStyle: 'line'
                },
                {
                    label: 'Opponent',
                    data: opponentScores,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointStyle: 'line'
                }
            ]
        },
        options: {
            scales: {
                x: { ticks: { font: { size: 16 } } },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : '',
                        font: { size: 16 }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: { size: 18 },
                        usePointStyle: true // Use line style for legend
                    }
                },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            },
            elements: {
                point: {
                    radius: 0 // Remove the default point circles from the chart lines
                }
            }
        }
    });
}



// Function to render a pie chart (Victories and Losses or Margins)
function renderPieChart(chartId, labels, data, backgroundColors) {
    const ctxPie = document.getElementById(chartId).getContext('2d');
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
                legend: { position: 'top', labels: { font: { size: 18 } } },
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
    const gameDurations = gameResults.map(result => {
        const startTime = new Date(result.date_time);
        const endTime = new Date(result.end_time);
        return (endTime - startTime) / 60000;
    });

    const ctxBar = document.getElementById('gameDurationChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Game Duration (minutes)',
                data: gameDurations,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: { ticks: { font: { size: 16 } } },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : '',
                        font: { size: 16 }
                    }
                }
            },
            plugins: {
                legend: { labels: { font: { size: 18 } } },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            }
        }
    });
}

// Function to render the bar chart for game intensity (Scores per minute)
function renderIntensityChart(labels, gameResults) {
    const gameIntensity = gameResults.map(result => {
        const startTime = new Date(result.date_time);
        const endTime = new Date(result.end_time);
        const duration = (endTime - startTime) / 60000;
        const totalScore = result.score[0] + result.score[1];
        return totalScore / duration;
    });

    const ctxIntensity = document.getElementById('gameIntensityChart').getContext('2d');
    new Chart(ctxIntensity, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Game Intensity (Scores per Minute)',
                data: gameIntensity,
                backgroundColor: gameIntensity.map(value => {
                    const intensity = Math.min(value / Math.max(...gameIntensity), 1);
                    return `rgba(255, 99, 132, ${intensity})`;
                }),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: { ticks: { font: { size: 16 } } },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : '',
                        font: { size: 16 }
                    }
                }
            },
            plugins: {
                legend: { labels: { font: { size: 18 } } },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 },
                    callbacks: {
                        label: function (context) {
                            const game = gameResults[context.dataIndex];
                            const startTime = new Date(game.date_time).toLocaleTimeString('en-GB', { timeZone: 'UTC' });
                            const endTime = new Date(game.end_time).toLocaleTimeString('en-GB', { timeZone: 'UTC' });
                            return `Intensity: ${context.raw.toFixed(2)} scores/min (Start: ${startTime}, End: ${endTime})`;
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

// Function to open the modal and render the progression chart
function openGameProgressionModal(scoreProgression, gameNumber) {
    const modal = new bootstrap.Modal(document.getElementById('gameProgressionModal'));
    const canvasId = 'scoreProgressionChartModal';
    
    // Clear the existing chart (if any)
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    // Render the progression chart inside the modal
    renderScoreProgressionChart(scoreProgression, canvasId, gameNumber);

    // Open the modal
    modal.show();
}

// Function to render the score progression chart in the modal
function renderScoreProgressionChart(scoreProgression, canvasId, gameNumber) {
    const ctxProgression = document.getElementById(canvasId).getContext('2d');
    const playerProgression = scoreProgression.map(score => score[0]);
    const opponentProgression = scoreProgression.map(score => score[1]);

    new Chart(ctxProgression, {
        type: 'line',
        data: {
            labels: playerProgression.map((_, index) => `Point ${index + 1}`),  // Labels: Point 1, Point 2, etc.
            datasets: [
                {
                    label: `You - Game ${gameNumber}`,
                    data: playerProgression,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointStyle: 'line' // Use line style for legend
                },
                {
                    label: `Opponent - Game ${gameNumber}`,
                    data: opponentProgression,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointStyle: 'line' // Use line style for legend
                }
            ]
        },
        options: {
            scales: {
                x: { ticks: { font: { size: 16 } } },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 16 }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: { size: 18 },
                        usePointStyle: true // Display lines in the legend
                    }
                },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            },
            elements: {
                point: {
                    radius: 0 // Keep circular points visible on the chart
                }
            }
        }
    });
}


// Call the fetchDashboardData function to get the data and render the charts
fetchDashboardData();

}
