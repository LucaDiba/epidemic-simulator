var population_ID = 0;
var person_ID = 0;
var dailyCallInterval;
var runningSimulation = false;
var layer;
var requestAnimationFrameCall;
var timers = [];
const CIRCLE_RADIUS = 5;

class Person {
    constructor() {
        this._id = person_ID++;
        this.circle = new Konva.Circle({
            radius: CIRCLE_RADIUS,
            fill: COLORS.circles.healthy.fill,
            stroke: COLORS.circles.healthy.stroke,
            x: Math.random() * maxX,
            y: Math.random() * maxY,
        });
        this.infected = false;
        this.immune = false;
        this.inQuarantine = false;
        this.inIntensiveCare = false;
        this.isAsymptomatic = (Math.random() < asymptomaticRate) ? true : false;
        this.needsIntensiveCare = (Math.random() < intensiveCareRate) ? true : false;

        this.speedX = getNewSpeed();
        this.speedY = getNewSpeed();
        this.peopleInRadius = [];
    }

    getId() {
        return _id;
    }
    getPopulation() {
        return this.population;
    }

    setPopulation(pop) {
        this.population = pop;
    }

    infect() {
        if (this.infected == false && this.immune == false) {
            this.infected = true;

            // Change dot color from healthy to infected
            this.circle.fill(COLORS.circles.infected.fill);
            this.circle.stroke(COLORS.circles.infected.stroke);

            // Add person to infected people array
            this.population.infectedPeople.push(this);

            // Update statistics
            statistics.currentInfected = this.population.infectedPeople.length;

            if (this.needsIntensiveCare) {
                timers.push(setTimeout(function () {
                    /* If there are no available beds in intensive care, the person will die */
                    if (statistics.currentInIntensiveCare >= intensiveCareBeds) {
                        statistics.currentDeadForIntensiveCare += 1;
                        this.kill();
                    } else {
                        this.inIntensiveCare = true;
                        this.moveToStage('intensive_care');

                        if (Math.random() < lethalityRate) {
                            timers.push(setTimeout(this.kill.bind(this), infectionDuration * 1000));
                        } else {
                            timers.push(setTimeout(function () {
                                this.immunize();
                                this.moveToStage('main');
                                this.inIntensiveCare = false;
                            }.bind(this), infectionDuration * 1000));
                        }
                    }
                }.bind(this), daysBeforeSymphtoms * 1000));

            } else {
                if (quarantineActivated && !this.isAsymptomatic) {
                    timers.push(setTimeout(this.moveToStage.bind(this), daysBeforeSymphtoms * 1000, 'quarantine'));
                }

                if (Math.random() < lethalityRate) {
                    timers.push(setTimeout(this.kill.bind(this), infectionDuration * 1000));
                } else {
                    timers.push(setTimeout(this.immunize.bind(this), infectionDuration * 1000));
                }
            }
        }
    }

    immunize() {
        this.immune = true;
        this.infected = false;

        this.circle.fill(COLORS.circles.immune.fill);
        this.circle.stroke(COLORS.circles.immune.stroke);

        // Remove from infected array
        let index = this.population.infectedPeople.indexOf(this);
        this.population.infectedPeople.splice(index, 1);

        // Add to immune array
        if (this.inQuarantine) {
            this.moveToStage('main');
        }

        // Update statistics
        statistics.currentInfected = this.population.infectedPeople.length;
        statistics.currentCured += 1;
    }

    kill() {
        if (this.inQuarantine) {
            statistics.currentInQuarantine -= 1;
        }
        if (this.inIntensiveCare) {
            statistics.currentInIntensiveCare -= 1;
        }

        // Remove from infected array
        let index = this.population.infectedPeople.indexOf(this);
        this.population.infectedPeople.splice(index, 1);

        // Move circle to dead stage
        this.moveToStage('dead');

        statistics.currentInfected = this.population.infectedPeople.length;
        statistics.currentDead += 1;
    }

    moveToStage(move_to) {
        if (this.inQuarantine && move_to == 'main') {
            statistics.currentInQuarantine -= 1;

            layer.add(this.circle);
            this.circle_quarantine.remove();
            this.inQuarantine = false;
        }
        if (this.inIntensiveCare && move_to == 'main') {
            statistics.currentInIntensiveCare -= 1;

            layer.add(this.circle);
            this.circle_intensive_care.remove();
            layer_intensive_care.batchDraw();
        }
        if (move_to == 'quarantine') {
            statistics.currentInQuarantine += 1;

            /* Remove from main layer */
            if (this.circle) {
                this.circle.remove();
            }

            /* Create new circle for quarantine layer */
            this.circle_quarantine = new Konva.Circle({
                radius: CIRCLE_RADIUS,
                fill: COLORS.circles.infected.fill,
                stroke: COLORS.circles.infected.stroke,
                x: Math.random() * (stage_quarantine.attrs.width - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
                y: Math.random() * (stage_quarantine.attrs.height - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
            });
            layer_quarantine.add(this.circle_quarantine);

            this.inQuarantine = true;
        }
        if (move_to == 'dead') {
            /* Remove from layers */
            if (this.circle) {
                this.circle.destroy();
            }
            if (this.circle_quarantine) {
                this.circle_quarantine.destroy();
            }
            if (this.circle_intensive_care) {
                this.circle_intensive_care.destroy();
            }

            /* Create new circle for dead layer */
            this.circle_dead = new Konva.Circle({
                radius: CIRCLE_RADIUS,
                fill: COLORS.circles.dead.fill,
                stroke: COLORS.circles.dead.stroke,
                x: Math.random() * (stage_dead.attrs.width - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
                y: Math.random() * (stage_dead.attrs.height - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
            });
            layer_dead.add(this.circle_dead);

            layer_dead.batchDraw();
            layer_intensive_care.batchDraw();
        }
        if (move_to == 'intensive_care') {
            statistics.currentInIntensiveCare += 1;

            /* Remove from layers */
            if (this.circle) {
                this.circle.remove();
            }

            /* Create new circle for dead layer */
            this.circle_intensive_care = new Konva.Circle({
                radius: CIRCLE_RADIUS,
                fill: COLORS.circles.intensive_care.fill,
                stroke: COLORS.circles.intensive_care.stroke,
                x: Math.random() * (stage_intensive_care.attrs.width - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
                y: Math.random() * (stage_intensive_care.attrs.height - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
            });
            layer_intensive_care.add(this.circle_intensive_care);
            layer_intensive_care.batchDraw();
        }
    }

    moveCircle(circle, maxX, maxY) {
        circle.setX(circle.getX() + this.speedX);
        circle.setY(circle.getY() + this.speedY);

        // If out of bound
        if (circle.getX() > maxX - 5) {
            this.speedX *= -1;
            circle.setX(maxX - 5);
        } else if (circle.getX() - 5 < minX) {
            this.speedX *= -1;
            circle.setX(minX + 5);
        }

        // If out of bound
        if (circle.getY() > maxY - 5) {
            this.speedY *= -0.85;
            circle.setY(maxY - 5);
        } else if (circle.getY() - 5 < minY) {
            this.speedY *= -0.85;
            circle.setY(minY + 5);
        }
    }

    update() {
        this.speedX = getNewSpeed(this.speedX);
        this.speedY = getNewSpeed(this.speedY);

        if (this.inQuarantine) {
            this.moveCircle(this.circle_quarantine, stage_quarantine.attrs.width, stage_quarantine.attrs.height);
        } else {
            this.moveCircle(this.circle, maxX, maxY);
        }

        // Check if to be infected
        if (this.infected == false && this.immune == false) {
            this.population.infectedPeople.forEach(tmp_person => {
                if (this._id !== tmp_person._id) {
                    let a = this.circle.getX() - tmp_person.circle.getX();
                    let b = this.circle.getY() - tmp_person.circle.getY();
                    let distance = Math.sqrt(a * a + b * b);
                    if (distance < infectionRadius && !this.peopleInRadius.includes(tmp_person._id)) {
                        if (Math.random() < infectionRate) {
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
    constructor() {
        this._id = population_ID++;
        this.people = [];
        this.infectedPeople = [];
    }

    getId() {
        return _id;
    }

    getPerson(id) {
        return this.people[id];
    }

    addPerson() {
        var person = new Person();
        person.setPopulation(this);
        this.people.push(person);
        return person;
    }

    getSize() {
        return this.people.length;
    }

    update() {
        for (var i = 0; i < this.people.length; i++) {
            this.getPerson(i).update();
        }
    }

    clear() {
        population_ID = 0;
        person_ID = 0;
        for (var i = 0; i < this.people.length; i++) {
            let person = this.people[i];
            person.circle.destroy();
            if (person.circle_quarantine) {
                person.circle_quarantine.destroy();
            }
            if (person.circle_dead) {
                person.circle_dead.destroy();
            }
            if (person.circle_intensive_care) {
                person.circle_intensive_care.destroy();
            }
        }

        layer_dead.batchDraw();
        layer_intensive_care.batchDraw();

        this.people = [];
        this.infectedPeople = [];
    }
}

var width = document.getElementById('stage_container').offsetWidth;
var height = document.getElementById('stage_container').offsetHeight;

var minX = 0;
var maxX = width;
var minY = 0;
var maxY = height;

var infectionRadius = 10;

var population = new Population();

var stage = new Konva.Stage({
    container: 'stage_container',
    width: width,
    height: height
});
var stage_quarantine = new Konva.Stage({
    container: 'stage_quarantine_container',
    width: document.getElementById('stage_quarantine_container').offsetWidth,
    height: document.getElementById('stage_quarantine_container').offsetHeight
});
var stage_dead = new Konva.Stage({
    container: 'stage_dead_container',
    width: document.getElementById('stage_dead_container').offsetWidth,
    height: document.getElementById('stage_dead_container').offsetHeight
});
var stage_intensive_care = new Konva.Stage({
    container: 'stage_intensive_care_container',
    width: document.getElementById('stage_intensive_care_container').offsetWidth,
    height: document.getElementById('stage_intensive_care_container').offsetHeight
});

layer = new Konva.FastLayer();
layer_quarantine = new Konva.FastLayer();
layer_dead = new Konva.FastLayer();
layer_intensive_care = new Konva.FastLayer();

stage.add(layer);
stage_quarantine.add(layer_quarantine);
stage_dead.add(layer_dead);
stage_intensive_care.add(layer_intensive_care);

statistics.totalPeople = initialPopulation;
statistics.currentInfected = initialInfected;
statistics.currentCured = 0;
statistics.currentDead = 0;

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

    statistics.reset();

    requestAnimationFrameCall = window.requestAnimationFrame(updateAnimationFrame);

    for (var i = 0; i < initialPopulation; i++) {
        var person = population.addPerson();

        if (i < initialInfected) {
            person.infect();
        }
        layer.add(person.circle);
    }
    layer.batchDraw();
    layer_quarantine.batchDraw();
    layer_dead.batchDraw();
    dailyCallInterval = setInterval(dailyCall, 1000);
}

function stopSimulation() {
    statistics.reset();    
    if (runningSimulation) {
        population.clear();
        clearInterval(dailyCallInterval);
        cancelAnimationFrame(requestAnimationFrameCall);
        timers.forEach(timer => {
            if (timer) {
                clearTimeout(timer);
            }
        });
    }
}

function updateAnimationFrame() {
    cancelAnimationFrame(requestAnimationFrameCall);
    population.update();

    layer.batchDraw();
    layer_quarantine.batchDraw();

    requestAnimationFrameCall = requestAnimationFrame(updateAnimationFrame);
}

function dailyCall() {
    for (let i = 0; i < population.people.length; i++) {
        let person = population.getPerson(i);

        /* Reset people in radius to prevent to not infect people for days when speed is low */
        person.peopleInRadius = [];
    }
}