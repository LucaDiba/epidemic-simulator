var listeners = {
    intensiveCare: function () {
        intensiveCareBeds = Math.ceil(parseInt(document.getElementById('control_intensive_care_beds').value) / 100 * initialPopulation);
        document.getElementById('max_total_in_intensive_care').innerHTML = intensiveCareBeds;
    },
};

/* People speed */
document.getElementById('control_people_speed').addEventListener('change', function (e) {
    let inputPeopleSpeed = this.value;
    maxVelocity = inputPeopleSpeed * 6 / 100;
});

/* Initial population */
document.getElementById('control_initial_population').addEventListener('change', function (e) {
    this.value = parseInt(this.value);
    inputInitialPopulation = this.value;
    if (inputInitialPopulation > MAX_INITIAL_POPULATION) {
        this.value = initialPopulation;
        alert('The number is too high. Maximum value for initial population is ' + MAX_INITIAL_POPULATION);
    } else {
        initialPopulation = inputInitialPopulation;
        statistics.totalPeople = initialPopulation;
        listeners.intensiveCare();
    
        lineGraph.options.scales.yAxes[0].ticks.max = parseFloat(initialPopulation);
        lineGraph.update();
    }
});

/* Initial infected */
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

/* Infection rate */
document.getElementById('control_infection_rate').addEventListener('input', function (e) {
    infectionRate = this.value / 100;
    document.getElementById('control_infection_rate_text').innerHTML = Math.round(infectionRate * 100);
});

/* Desease duration */
document.getElementById('control_desease_duration').addEventListener('change', function (e) {
    infectionDuration = this.value;
});

/* Lethality rate */
document.getElementById('control_lethality_rate').addEventListener('input', function (e) {
    lethalityRate = this.value / 100;
    document.getElementById('control_lethality_rate_text').innerHTML = Math.round(lethalityRate * 100);
});

/* Quarantine activation */
document.getElementById('control_quarantine').addEventListener('input', function (e) {
    quarantineActivated = this.checked;
});

/* Days before going in quarantine */
document.getElementById('control_days_to_quarantine').addEventListener('change', function (e) {
    daysBeforeSymphtoms = this.value;
});

/* Asymptomatic rate */
document.getElementById('control_asymptomatic_rate').addEventListener('input', function (e) {
    asymptomaticRate = this.value / 100;
    document.getElementById('control_asymptomatic_rate_text').innerHTML = Math.round(asymptomaticRate * 100);
});

/* Intensive care rate */
document.getElementById('control_intensive_care_rate').addEventListener('input', function (e) {
    intensiveCareRate = this.value / 100;
    document.getElementById('control_intensive_care_rate_text').innerHTML = Math.round(intensiveCareRate * 100);
});

/* Intensive care beds every 100 people */
document.getElementById('control_intensive_care_beds').addEventListener('change', listeners.intensiveCare);

/* Button: stop simulation */
document.getElementById('control_stop').addEventListener('click', function (e) {
    stopSimulation();
    resetChart();
});

/* Button: start simulation */
document.getElementById('control_start').addEventListener('click', function (e) {
    stopSimulation();
    resetChart();

    document.getElementById('simulator').style.display = 'block';
    // location.hash = "#simulator";
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#simulator").offset().top
    }, 1000);

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

/* Hide simulator before the first start of the simulation */
document.getElementById('simulator').style.display = 'none';

/* Set input of the form to the initial values */
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

document.getElementById('control_intensive_care_rate').value = intensiveCareRate * 100;
document.getElementById('control_intensive_care_rate_text').innerHTML = intensiveCareRate * 100;

document.getElementById('control_intensive_care_beds').value = intensiveCareBeds * 100 / initialPopulation;
document.getElementById('max_total_in_intensive_care').innerHTML = intensiveCareBeds;