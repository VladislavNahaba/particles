import "../style/style.css";

// create mouse handler
class MouseHandler {
    constructor(cnvWidth, cnvHeight, multiplier) {
        this.x = undefined;
        this.y = undefined;
        const koef = (1 + (1 / multiplier)) * 40;
        this.radius = (cnvWidth / koef) * (cnvHeight / koef);
        this.#mousemoveHandler();
    }

    #mousemoveHandler() {
        window.addEventListener('mousemove', e => {
            this.x = e.x;
            this.y = e.y;
        });
    }

    getX() {
        return this.x;
    }

    setX(val) {
        this.x = val;
    }

    getY() {
        return this.y;
    }

    setY(val) {
        this.y = val;
    }

    updateRadius(cnvWidth, cnvHeight, multiplier) {
        const koef = (1 + (1 / multiplier)) * 40;
        this.radius = (cnvWidth / koef) * (cnvHeight / koef);
    }

    getRadius() {
        return this.radius;
    }
}

// create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // draw individual particle
    draw() {
        return ctx => {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // check particle position, check mouse position, move the particle
    update(cnvWidth, cnvHeight, mouse) {
        // check if particle is still within canvas
        if (this.x > cnvWidth || this.x <= 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > cnvHeight || this.y <= 0) {
            this.directionY = -this.directionY;
        }
        // check collision - mouse, particle
        let dx = this.x - mouse.getX();
        let dy = this.y - mouse.getY();
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < mouse.getRadius() + this.size) {
            if (mouse.getX() < this.x && this.x < cnvWidth - this.size * 10) {
                this.x += 5;
                this.directionX = -this.directionX
            }
            if (mouse.getX() > this.x && this.x > this.size * 10) {
                this.x -= 5;
                this.directionX = -this.directionX
            }
            if (mouse.getY() < this.y && this.y < cnvHeight - this.size * 10) {
                this.y += 5;
                this.directionY = -this.directionY;
            }
            if (mouse.getY() > this.y && this.y > this.size * 10) {
                this.y -= 5;
                this.directionY = -this.directionY;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
    }

    // factory
    static create(x, y, directionX, directionY, size, color) {
        return new Particle(x, y, directionX, directionY, size, color);
    }
}

class Drawer {
    constructor(cnv) {
        if (!cnv) throw new Error('Canvas is not defined');
        this.ctx = cnv.getContext('2d');
    }

    draw(func) {
        func(this.ctx);
    }
}

class ParticlesLayout {
    constructor
    (
        selector = 'body',
        layout = {
            color: 'radial-gradient(#ffc38c, #ff9b40)',
            mouseRadiusMultiplier: 1
        },
        particles = {
            color: '#8c5523',
            speed: 3,
            numberMultiplier: 1,
            size: 5,
            connect: true,
            connectColor: {
                r: 140,
                g: 85,
                b: 31
            },
            connectLengthMultiplier: 10,
            connectOpacityMultiplier: 3
        }
    ) {
        this.selector = selector ? selector : 'body';

        this.layoutSettings = {
            color: 'radial-gradient(#ffc38c, #ff9b40)',
            mouseRadiusMultiplier: 1,
            ...layout
        };

        this.particlesSettings = {
            color: '#8c5523',
            speed: 3,
            numberMultiplier: 1,
            size: 5,
            connect: true,
            connectColor: {
                r: 140,
                g: 85,
                b: 31
            },
            connectLengthMultiplier: 10,
            connectOpacityMultiplier: 3,
            ...particles
        };

        // before init
        this.#beforeInit();

        this.particlesArray = [];
        this.mouse = new MouseHandler(this.cnv.width, this.cnv.height, this.layoutSettings.mouseRadiusMultiplier);
        this.drawer = new Drawer(this.cnv);

        // initialize canvas
        this.#init();

        // set listeners after init
        this.#afterInit();
    }

    #beforeInit() {
        this.#appendCanvas();
    }

    #appendCanvas() {
        const selector = document.querySelector(this.selector);
        const element = document.createElement('canvas');
        element.className = 'canvas-particle-layout';
        element.width = window.innerWidth;
        element.height = window.innerHeight;
        element.style.setProperty('position', 'absolute');
        element.style.setProperty('top', 0);
        element.style.setProperty('left', 0);
        element.style.setProperty('width', '100%');
        element.style.setProperty('height', '100%');
        element.style.setProperty('background', this.layoutSettings.color);
        selector.appendChild(element);
        this.cnv = element;
    }

    #afterInit() {
        this.#resizeCanvas();
        this.#mouseOut();
    }

    // resize event
    #resizeCanvas() {
        window.addEventListener('resize', () => {
            this.cnv.width = window.innerWidth;
            this.cnv.height = window.innerHeight;
            this.mouse.updateRadius(this.cnv.width, this.cnv.height, this.layoutSettings.mouseRadiusMultiplier);
        })
    }

    // mouse out event
    #mouseOut() {
        window.addEventListener('mouseout', () => {
            this.mouse.setX(undefined);
            this.mouse.setY(undefined);
        })
    }

    // set array of particles
    #createParticles() {
        let numberOfParticles = (this.cnv.height * this.cnv.width) / 10000;
        for (let i = 0; i < numberOfParticles * this.particlesSettings.numberMultiplier; i++) {
            let size = (Math.random() * this.particlesSettings.size) + 1;
            let x = ( Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2 );
            let y = ( Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2 );
            let directionX = ((Math.random() * this.particlesSettings.speed) - this.particlesSettings.speed / 3) * (1 / (size / 2));
            let directionY = ((Math.random() * this.particlesSettings.speed) - this.particlesSettings.speed / 3) * (1 / (size / 2));
            let color = this.particlesSettings.color;

            this.particlesArray.push(Particle.create(x, y, directionX, directionY, size, color, this.mouse));
        }
    }

    #animate() {
        // animate every particle
        requestAnimationFrame(this.#animate.bind(this));
        this.drawer.draw(ctx => ctx.clearRect(0, 0, window.innerWidth, window.innerHeight));

        // redraw
        for (let i = 0; i < this.particlesArray.length; i++) {
            this.particlesArray[i].update(this.cnv.width, this.cnv.height, this.mouse);
            this.drawer.draw(this.particlesArray[i].draw());
        }

        if (this.particlesSettings.connect) {
            this.#connect();
        }
    }

    // check if particles are close enough to draw line between them
    #connect() {
        for (let a = 0; a < this.particlesArray.length; a++) {
            for (let b = a ; b < this.particlesArray.length; b++) {
                let distance = (( this.particlesArray[a].x - this.particlesArray[b].x ) * 
                    (this.particlesArray[a].x - this.particlesArray[b].x))
                    +
                    (( this.particlesArray[a].y - this.particlesArray[b].y ) * 
                    (this.particlesArray[a].y - this.particlesArray[b].y));

                if (
                    distance < (
                        this.cnv.width /
                        (200 * (1 / this.particlesSettings.connectLengthMultiplier))) *
                        (this.cnv.height /
                        (200 * (1 / this.particlesSettings.connectLengthMultiplier)))
                    ) {
                    this.drawer.draw(ctx => {
                        // make particles innvisible if the distance are too big
                        let opacityValue = 1 - (distance / (this.particlesSettings.connectOpacityMultiplier * 500));
                        ctx.strokeStyle = `rgba(${this.particlesSettings.connectColor.r}, ${this.particlesSettings.connectColor.g}, ${this.particlesSettings.connectColor.b}, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(this.particlesArray[a].x, this.particlesArray[a].y);
                        ctx.lineTo(this.particlesArray[b].x, this.particlesArray[b].y);
                        ctx.stroke();
                    })
                }
            }
        }
    }

    #init() {
        this.#createParticles();
        this.#animate();
    }
}
const layout = new ParticlesLayout('body', {
    mouseRadiusMultiplier: 1
}, {
    speed: 5,
    connectOpacityMultiplier: 5
});