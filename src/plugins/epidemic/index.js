var population_ID = 0;
var person_ID = 0;
var dailyCallInterval;
var runningSimulation = false;
var layer;
var requestAnimationFrameCall;

class Person {
    constructor(){
        this._id = person_ID++;
        this.circle = new Konva.Circle({
            radius: 5,
            fill: 'black',
            x: Math.random() * maxX,
            y: Math.random() * maxY,
        });
        this.infected = false;
        this.immune = false;
        this.inQuarantine = false;
        this.isAsymptomatic = (Math.random() < asymptomaticRate) ? true : false;

        this.speedX = getNewSpeed();
        this.speedY = getNewSpeed();
        this.peopleInRadius = [];
    }

	getId = function() {
		return _id;
	}
	getPopulation = function() {
		return this.population;
	}
    
    setPopulation = function(pop) {
		this.population = pop;
    }

    infect = function() {
        if(this.infected == false && this.immune == false){
            this.infected = true;
            this.infectedTimestamp = Date.now();
            this.circle.fill('red');
            this.population.infectedPeople.push(this);

            // Update statistics
            statistics.currentInfected = this.population.infectedPeople.length;
        }
    }

    immunize = function() {
        this.immune = true;
        this.infected = false;
        this.circle.fill('green');

        // Remove from infected array
        let index = this.population.infectedPeople.indexOf(this);
        this.population.infectedPeople.splice(index, 1);

        // Add to immune array or kill
        if(Math.random() < lethalityRate) {
            this.population.deadPeople.push(this);
            this.circle.destroy();
        } else {
            this.population.immunePeople.push(this);
        }

        // Update statistics
        statistics.currentInfected = this.population.infectedPeople.length;
        statistics.currentCured = this.population.immunePeople.length;
        statistics.currentDead = this.population.deadPeople.length;
    }
    
    update = function() {
        this.speedX = getNewSpeed(this.speedX);
        this.speedY = getNewSpeed(this.speedY);

        this.circle.setX(this.circle.getX() + this.speedX);
        this.circle.setY(this.circle.getY() + this.speedY);

        // If out of bound
        if (this.circle.getX() > maxX - 5) {
            this.speedX *= -1;
            this.circle.setX(maxX - 5);
        } else if (this.circle.getX() - 5 < minX) {
            this.speedX *= -1;
            this.circle.setX(minX + 5);
        }

        // If out of bound
        if (this.circle.getY() > maxY - 5) {
            this.speedY *= -0.85;
            this.circle.setY(maxY - 5);
        } else if (this.circle.getY() - 5 < minY) {
            this.speedY *= -0.85;
            this.circle.setY(minY + 5);
        }

        // Check if to be infected
        if(this.infected == false && this.immune == false){
            this.population.infectedPeople.forEach(tmp_person => {
                if(this._id !== tmp_person._id) {
                    let a = this.circle.getX() - tmp_person.circle.getX();
                    let b = this.circle.getY() - tmp_person.circle.getY();
                    let distance = Math.sqrt( a*a + b*b );
                    if (distance < infectionRadius && !this.peopleInRadius.includes(tmp_person._id)){
                        if(Math.random() < infectionRate) {
                            this.infect();
                        }
                        this.peopleInRadius.push(tmp_person._id);
                    }
                    if (distance > infectionRadius) {
                        let index = this.peopleInRadius.indexOf(tmp_person._id);
                        if (index !== -1) this.peopleInRadius.slice(index, 1);
                    }
                }
            });
        }
    }
}

class Population {
    constructor(){
        this._id = population_ID++;
        this.people = [];
        this.infectedPeople = [];
        this.immunePeople = [];
        this.deadPeople = [];
    }

	getId = function() {
		return _id;
    }
    
    getPerson = function(id) {
        return this.people[id];
    }

    addPerson = function() {
        var person = new Person();
        person.setPopulation(this);
        this.people.push(person);
        return person;
    }

    getSize = function() {
        return this.people.length;
    }

    update = function() {
        for (var i = 0; i < this.people.length; i++) {
            this.getPerson(i).update();
        }
    }

    clear = function() {
        population_ID = 0;
        person_ID = 0;
        for (var i = 0; i < this.people.length; i++) {
            this.people[i].circle.destroy();
        }

        this.people = [];
        this.infectedPeople = [];
        this.immunePeople = [];
        this.deadPeople = [];
    }
}

var width = document.getElementById('stage_container').offsetWidth;
var height = document.getElementById('stage_container').offsetHeight;

var minX = 0;
var maxX = width;
var minY = 0;
var maxY = height;

var startedTime;
var infectionRadius = 10;

var population = new Population();

var stage = new Konva.Stage({
    container: 'stage_container',
    width: width,
    height: height
});

statistics.totalPeople = initialPopulation;
statistics.currentInfected = initialInfected;
statistics.currentCured = 0;
statistics.currentDead = 0;

layer = new Konva.FastLayer();
stage.add(layer);

function getNewSpeed(currentSpeed) {
    let newSpeed;
    if (currentSpeed) {
        newSpeed = currentSpeed + Math.sin(Math.random() * 2 - 1);
        if (Math.abs(newSpeed) > maxVelocity) {
            newSpeed = Math.sign(newSpeed) * maxVelocity;
        }
    } else {
        newSpeed = Math.sin(Math.random() * 2 - 1) * maxVelocity;
    }
    return newSpeed;
}

function startSimulation() {
    runningSimulation = true;
    startedTime = Date.now();

    statistics.totalPeople = initialPopulation;
    statistics.currentCured = 0;
    statistics.currentInfected = initialInfected;
    statistics.currentDead = 0;

    requestAnimationFrameCall = window.requestAnimationFrame(update);
    
    for (var i = 0; i < initialPopulation; i++) {
        var person = population.addPerson();

        if (i < initialInfected) {
            person.infect();
        }
        layer.add(person.circle);
    }
    layer.batchDraw();
    dailyCallInterval = setInterval(dailyCall, 1000);
}

function stopSimulation() {
    if (runningSimulation) {
        population.clear();
        clearInterval(dailyCallInterval);
        cancelAnimationFrame(requestAnimationFrameCall);
    }
}

function update() {
    cancelAnimationFrame(requestAnimationFrameCall);
    population.update();
    layer.batchDraw();
    requestAnimationFrameCall = requestAnimationFrame(update);
}

function dailyCall() {
    for (let i = 0; i < population.people.length; i++) {
        let person = population.getPerson(i);

        /* Check if person should become healthy */
        if(person.infected) {
            let infectedDays = (Date.now() - person.infectedTimestamp) / 1000;
            if (infectedDays > infectionDuration) {
                person.immunize();
            }
        }

        /* Check if person should go in (or come back from) quarantine */
        if(quarantineActivated) {
            if (person.infected && !person.inQuarantine && !person.isAsymptomatic) {
                // TODO: move in quarantine
            }
            if (person.inQuarantine && !person.infected) {
                // TODO: end quarantine

            }
        }

        /* Reset people in radius to prevent to not infect people for days when speed is low */
        person.peopleInRadius = [];
    }
}