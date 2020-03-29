
/* Form listeners */
document.getElementById('control_people_speed').addEventListener('change', function (e) {
    let inputPeopleSpeed = document.getElementById('control_people_speed').value;
    maxVelocity = inputPeopleSpeed * 6 / 100;
});
document.getElementById('control_initial_population').addEventListener('change', function (e) {
    initialPopulation = document.getElementById('control_initial_population').value;
    document.getElementById('total_people').innerHTML = initialPopulation;

    lineGraph.options.scales.yAxes[0].ticks.max = parseFloat(initialPopulation);
    lineGraph.update();
});
document.getElementById('control_initial_infected').addEventListener('change', function (e) {
    inputInitialInfected = document.getElementById('control_initial_infected').value;
    if (inputInitialInfected > initialPopulation) {
        alert('Number of infected must be lower than the number of total people');
        document.getElementById('control_initial_infected').value = initialInfected;
    } else {
        initialInfected = inputInitialInfected;
    }

    document.getElementById('total_infected').innerHTML = initialInfected;
});
document.getElementById('control_infection_rate').addEventListener('input', function (e) {
    infectionRate = document.getElementById('control_infection_rate').value / 100;
    document.getElementById('control_infection_rate_text').innerHTML = Math.round(infectionRate * 100);
});
document.getElementById('control_desease_duration').addEventListener('change', function (e) {
    infectionDuration = document.getElementById('control_desease_duration').value;
});
document.getElementById('control_lethality_rate').addEventListener('input', function (e) {
    lethalityRate = document.getElementById('control_lethality_rate').value / 100;
    document.getElementById('control_lethality_rate_text').innerHTML = Math.round(lethalityRate * 100);
});
document.getElementById('control_stop').addEventListener('click', function (e) {
    stopSimulation();
    resetChart();
    document.getElementById('simulator').style.display = 'none';
});
document.getElementById('control_start').addEventListener('click', function (e) {
    stopSimulation();
    resetChart();

    document.getElementById('simulator').style.display = 'block';
    location.hash = "#simulator";

    startSimulation();

    updateChart();
    updateChartInterval = setInterval(updateChart, 1000);
});

document.getElementById('simulator').style.display = 'none';

document.getElementById('control_initial_population').value = initialPopulation;
document.getElementById('total_people').innerHTML = initialPopulation;

document.getElementById('control_initial_infected').value = initialInfected;
document.getElementById('total_infected').innerHTML = initialInfected;

document.getElementById('control_people_speed').value = maxVelocity * 100 / 5;

document.getElementById('control_infection_rate').value = infectionRate * 100;
document.getElementById('control_infection_rate_text').innerText = infectionRate * 100;

document.getElementById('control_desease_duration').value = infectionDuration;

document.getElementById('control_lethality_rate').value = lethalityRate * 100;
document.getElementById('control_lethality_rate_text').innerHTML = lethalityRate * 100;