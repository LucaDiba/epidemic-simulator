var COLORS = {
    circles: {
        healthy: {
            fill: '#FFFFFF',
            stroke: '#808080',
        },
        intensive_care: {
            fill: '#8c0000',
            stroke: '#FF0000',
        },
        infected: {
            fill: '#FF0000',
            stroke: '#FF0000',
        },
        immune: {
            fill: '#00FFE7',
            stroke: '#005eff',
        },
        dead: {
            fill: '#000000',
            stroke: '#000000',
        }
    },
}
MAX_INITIAL_POPULATION = 1000;

/* Population */
maxVelocity = 3.0;
initialPopulation = 400;
initialInfected = 10;

/* Infection */
infectionRate = 0.2;
infectionDuration = 14;
lethalityRate = 0.02;

/* Quarantine */
quarantineActivated = true;
daysBeforeSymphtoms = 5;
asymptomaticRate = 0.1;

/* Intensive care */
intensiveCareRate = 0.2;
intensiveCareBeds = Math.ceil((5) / 100 * initialPopulation)

/* Chart with daily statistics*/
var lineGraph;

/*  */
var counters = {
    healthy: document.getElementById('total_healthy'),
    infected: document.getElementById('total_infected'),
    in_quarantine: document.getElementById('total_in_quarantine'),
    in_intensive_care: document.getElementById('total_in_intensive_care'),
    immune: document.getElementById('total_immune'),
    dead: document.getElementById('total_dead'),
    dead_for_intensive_care: document.getElementById('total_dead_for_intensive_care'),
}
var statistics = {
    reset: function() {
        this.totalPeople = initialPopulation;
        this.currentCured = 0;
        this.currentInfected = initialInfected;
        this.currentInQuarantine = 0;
        this.currentInIntensiveCare = 0;
        this.currentDead = 0;
        this.currentDeadForIntensiveCare = 0;
    },

    /* Total people */
    get totalPeople() {
        return this._totalPeople;
    },
    set totalPeople(value) {
        this._totalPeople = value;
        counters.healthy.innerHTML = this.currentHealthy;
    },

    /* Current infected */
    get currentInfected() {
        return this._currentInfected;
    },
    set currentInfected(value) {
        this._currentInfected = value;
        counters.infected.innerHTML = this._currentInfected;
        counters.healthy.innerHTML = this.currentHealthy;
    },

    /* Current in quarantine (among the infected) */
    get currentInQuarantine() {
        return this._currentInQuarantine;
    },
    set currentInQuarantine(value) {
        this._currentInQuarantine = value;
        counters.in_quarantine.innerHTML = this._currentInQuarantine;
    },

    /* Current in intensive care (among the infected) */
    get currentInIntensiveCare() {
        return this._currentInIntensiveCare;
    },
    set currentInIntensiveCare(value) {
        this._currentInIntensiveCare = value;
        counters.in_intensive_care.innerHTML = this._currentInIntensiveCare;
    },
    
    /* Current cured */
    get currentCured() {
        return this._currentCured;
    },
    set currentCured(value) {
        this._currentCured = value;
        counters.immune.innerHTML = this._currentCured;
        counters.healthy.innerHTML = this.currentHealthy;
    },

    /* Current deaths */
    get currentDead() {
        return this._currentDead;
    },
    set currentDead(value) {
        this._currentDead = value;
        counters.dead.innerHTML = this._currentDead;
        counters.healthy.innerHTML = this.currentHealthy;
    },

    /* Current deaths because of lack of intensive care beds */
    get currentDeadForIntensiveCare() {
        return this._currentDeadForIC;
    },
    set currentDeadForIntensiveCare(value) {
        this._currentDeadForIC = value;
        counters.dead_for_intensive_care.innerHTML = this._currentDeadForIC;
    },

    /* Current healthy */
    get currentHealthy() {
        return this._totalPeople - this._currentInfected - this.currentCured - this._currentDead;
    },
}