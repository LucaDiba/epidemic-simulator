var COLORS = {
    circles: {
        healthy: {
            fill: '#FFFFFF',
            stroke: '#808080',
        },
        infected: {
            fill: '#FF0000',
            stroke: '#FF0000',
        },
        immune: {
            fill: '#00FFE7',
            stroke: '005eff',
        },
        dead: {
            fill: '#000000',
            stroke: '#000000',
        }
    },
}

maxVelocity = 2.0;
initialPopulation = 600;
initialInfected = 10;

infectionRate = 0.1;
infectionDuration = 14;
lethalityRate = 0.02;

quarantineActivated = true;
daysBeforeSymphtoms = 5;
asymptomaticRate = 0.1;

var lineGraph;

/*  */
var counters = {
    people: document.getElementById('total_people'),
    infected: document.getElementById('total_infected'),
    immune: document.getElementById('total_immune'),
    dead: document.getElementById('total_dead'),
}
var statistics = {
    get totalPeople() {
        return this._totalPeople;
    },
    set totalPeople(value) {
        this._totalPeople = value;
        counters.people.innerHTML = this._totalPeople;
    },

    get currentInfected() {
        return this._currentInfected;
    },
    set currentInfected(value) {
        this._currentInfected = value;
        counters.infected.innerHTML = this._currentInfected;
    },

    
    get currentCured() {
        return this._currentCured;
    },
    set currentCured(value) {
        this._currentCured = value;
        counters.immune.innerHTML = this._currentCured;
    },

    get currentDead() {
        return this._currentDead;
    },
    set currentDead(value) {
        this._currentDead = value;
        counters.dead.innerHTML = this._currentDead;
    },
}