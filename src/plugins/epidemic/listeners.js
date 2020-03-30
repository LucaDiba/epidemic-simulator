
/* Form listeners */
document.getElementById('control_people_speed').addEventListener('change', function (e) {
    let inputPeopleSpeed = this.value;
    maxVelocity = inputPeopleSpeed * 6 / 100;
});
document.getElementById('control_initial_population').addEventListener('change', function (e) {
    initialPopulation = this.value;
    statistics.totalPeople = initialPopulation;

    lineGraph.options.scales.yAxes[0].ticks.max = parseFloat(initialPopulation);
    lineGraph.update();
});
document.getElementById('control_initial_infected').addEventListener('change', function (e) {
    inputInitialInfected = parseInt(this.value);
    if (inputInitialInfected > initialPopulation) {
        alert('Number of infected must be lower than the number of total people');
        this.value = initialInfected;
    } else {
        initialInfected = inputInitialInfected;
    }

    document.getElementById('total_infected').innerHTML = initialInfected;
});
document.getElementById('control_infection_rate').addEventListener('input', function (e) {
    infectionRate = this.value / 100;
    document.getElementById('control_infection_rate_text').innerHTML = Math.round(infectionRate * 100);
});
document.getElementById('control_desease_duration').addEventListener('change', function (e) {
    infectionDuration = this.value;
});
document.getElementById('control_lethality_rate').addEventListener('input', function (e) {
    lethalityRate = this.value / 100;
    document.getElementById('control_lethality_rate_text').innerHTML = Math.round(lethalityRate * 100);
});
document.getElementById('control_quarantine').addEventListener('input', function (e) {
    quarantineActivated = this.checked;
});
document.getElementById('control_days_to_quarantine').addEventListener('change', function (e) {
    daysBeforeSymphtoms = this.value;
});
document.getElementById('control_asymptomatic_rate').addEventListener('input', function (e) {
    asymptomaticRate = this.value / 100;
    document.getElementById('control_asymptomatic_rate_text').innerHTML = Math.round(asymptomaticRate * 100);
});

document.getElementById('control_stop').addEventListener('click', function (e) {
    stopSimulation();
    resetChart();
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

/* Add a line to the graph whenever some parameter changes */
// TODO: add Chart Annotation plugin: https://github.com/chartjs/Chart.js/issues/4495#issuecomment-315238365

// document.getElementById('control_form').addEventListener('change', function(){
//     config.options.annotation.annotations.push({
//         type: "line",
//         mode: "vertical",
//         scaleID: "x-axis-0",
//         value: elapsedDays,
//         borderColor: "red",
//         label: {
//           content: ".",
//           enabled: true,
//           position: "top"
//         }
//       });
// })

document.getElementById('simulator').style.display = 'none';

document.getElementById('control_initial_population').value = initialPopulation;

document.getElementById('control_initial_infected').value = initialInfected;

document.getElementById('control_people_speed').value = maxVelocity * 100 / 5;

document.getElementById('control_infection_rate').value = infectionRate * 100;
document.getElementById('control_infection_rate_text').innerText = infectionRate * 100;

document.getElementById('control_desease_duration').value = infectionDuration;

document.getElementById('control_lethality_rate').value = lethalityRate * 100;
document.getElementById('control_lethality_rate_text').innerHTML = lethalityRate * 100;

document.getElementById('control_quarantine').checked = quarantineActivated;

document.getElementById('control_days_to_quarantine').value = daysBeforeSymphtoms;

document.getElementById('control_asymptomatic_rate').value = asymptomaticRate * 100;
document.getElementById('control_asymptomatic_rate_text').innerHTML = asymptomaticRate * 100;