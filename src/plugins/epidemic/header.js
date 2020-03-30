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
            stroke: '#005eff',
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
    healthy: document.getElementById('total_healthy'),
    infected: document.getElementById('total_infected'),
    immune: document.getElementById('total_immune'),
    dead: document.getElementById('total_dead'),
}
var statistics = {
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
    
    /* Current cured */
    get currentCured() {
        return this._currentCured;
    },
    set currentCured(value) {
        this._currentCured = value;
        counters.immune.innerHTML = this._currentCured;
    },

    /* Currend deaths */
    get currentDead() {
        return this._currentDead;
    },
    set currentDead(value) {
        this._currentDead = value;
        counters.dead.innerHTML = this._currentDead;
    },

    /* Current healthy */
    get currentHealthy() {
        return this._totalPeople - this._currentInfected - this.currentCured - this._currentDead;
    },
}