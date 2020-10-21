import "../style/style.css";

// create mouse handler
class MouseHandler {
    constructor(cnvWidth, cnvHeight, multiplier) {
        this.x = undefined;
        this.y = undefined;
        const koef = multiplier * 16;
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

    updateCnv(cnvWidth, cnvHeight) {
        this.radius = (cnvWidth / 80) * (cnvHeight / 80);
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
    update(cnvWidth,  cnvHeight, mouse) {
        // check if particle is still within canvas
        if (this.x > canvas.width || this.x <= 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y <= 0) {
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
            mouseRadiusMultiplier: 5
        },
        particles = {
            color: '#8c5523',
            speed: 3,
            numberMultiplier: 1,
            size: 5,
            connectColor: {
                r: 140,
                g: 85,
                b: 31
            },
            connectOpacityMultiplier: 3
        }
    ) {
        this.selector = selector ? selector : 'body';

        this.layoutSettings = {
            color: 'radial-gradient(#ffc38c, #ff9b40)',
            mouseRadiusMultiplier: 5,
            ...layout
        };

        this.particlesSettings = {
            color: '#8c5523',
            speed: 3,
            numberMultiplier: 1,
            size: 5,
            connectColor: {
                r: 140,
                g: 85,
                b: 31
            },
            connectOpacityMultiplier: 3,
            ...particles
        };

        this.particlesArray = [];
        this.cnv = document.querySelector('#canvas');
        this.cnv.width = window.innerWidth;
        this.cnv.height = window.innerHeight;
        this.mouse = new MouseHandler(this.cnv.width, this.cnv.height, this.layoutSettings.mouseRadiusMultiplier);
        this.drawer = new Drawer(this.cnv);

        // initialize canvas
        this.init();

        // set listeners after init
        this.#innerWork();
    }

    #innerWork() {
        this.#resizeCanvas();
        this.#mouseOut();
    }

    // resize event
    #resizeCanvas() {
        window.addEventListener('resize', () => {
            this.cnv.width = window.innerWidth;
            this.cnv.height = window.innerHeight;
            this.mouse.updateCnv(this.cnv.width, this.cnv.height);
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
    createParticles() {
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

    animate() {
        // animate every particle
        requestAnimationFrame(this.animate.bind(this));
        this.drawer.draw(ctx => ctx.clearRect(0, 0, window.innerWidth, window.innerHeight));

        // redraw
        for (let i = 0; i < this.particlesArray.length; i++) {
            this.particlesArray[i].update(this.cnv.width, this.cnv.height, this.mouse);
            this.drawer.draw(this.particlesArray[i].draw());
        }

        this.connect();
    }

    // check if particles are close enough to draw line between them
    connect() {
        for (let a = 0; a < this.particlesArray.length; a++) {
            for (let b = a ; b < this.particlesArray.length; b++) {
                let distance = (( this.particlesArray[a].x - this.particlesArray[b].x ) * 
                    (this.particlesArray[a].x - this.particlesArray[b].x))
                    +
                    (( this.particlesArray[a].y - this.particlesArray[b].y ) * 
                    (this.particlesArray[a].y - this.particlesArray[b].y));

                if (distance < (this.cnv.width / 20) * (this.cnv.height / 20)) {
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

    init() {
        this.createParticles();
        this.animate();
    }
}
const layout = new ParticlesLayout();