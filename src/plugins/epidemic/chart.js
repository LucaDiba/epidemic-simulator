
var elapsedDays = 0;
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Infected',
            backgroundColor: 'red',
            borderColor: 'black',
            data: [],
            fill: 'origin',
        }, {
            label: 'Healthy',
            fill: 'end',
            backgroundColor: 'white',
            borderColor: 'black',
            data: [],
            fill: '-1',
        }, {
            label: 'Cured',
            fill: 'end',
            backgroundColor: 'green',
            borderColor: 'black',
            data: [],
            fill: '-1',
        }, {
            label: 'Death',
            fill: 'end',
            backgroundColor: 'black',
            borderColor: 'black',
            data: [],
            fill: '-1',
        }]
    },
    options: {
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Days'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Number of people'
                },
                ticks: {
                    suggestedMax: initialPopulation,
                },
                stacked: true
            }]
        }
    }
};

var updateChartInterval;
function updateChart() {
    let total_people = statistics.totalPeople;
    let total_infected = statistics.currentInfected;
    let total_cured = statistics.currentCured;
    let total_dead = statistics.currentDead;

    config.data.labels.push(elapsedDays++);
    config.data.datasets[0].data.push(total_infected);
    config.data.datasets[1].data.push(total_people - total_infected - total_cured - total_dead);
    config.data.datasets[2].data.push(total_cured);
    config.data.datasets[3].data.push(total_dead);
    lineGraph.update();

    if (total_infected === 0) {
        clearInterval(updateChartInterval);
    }
}

window.onload = function () {
    var ctx = document.getElementById('chart').getContext('2d');
    lineGraph = new Chart(ctx, config);
};

function resetChart() {
    config.data.labels = [];
    config.data.datasets[0].data = [];
    config.data.datasets[1].data = [];
    config.data.datasets[2].data = [];
    config.data.datasets[3].data = [];
    elapsedDays = 0;
    if (updateChartInterval) {
        clearInterval(updateChartInterval);
    }
    updateChart();
}