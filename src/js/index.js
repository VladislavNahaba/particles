import "../style/style.css";

// document.addEventListener("load", () => {
// });


const cnv = document.querySelector('#canvas');
const ctx = cnv.getContext('2d');
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

let particlesArray;

// get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.width / 80) * (canvas.height / 80)
};

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});


// create mouse handler
class MouseHandler {
    constructor(radius) {
        this.x = null;
        this.y = null;
        this.radius = radius;
        this.#mousemoveHandler();
    }

    #mousemoveHandler() {
        window.addEventListener('mousemove', e => {
            this.x = e.x;
            this.y = e.y;
        });
    }

    get x() {
        return this.x;
    }

    get y() {
        return this.y;
    }

    get radius() {
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8C5523';
        ctx.fill();
    }

    // check particle position, check mouse position, move the particle, draw the particle
    update() {
        // check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        // check collision - mouse, particle
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.draw();
    }

    // factory
    static create(x, y, directionX, directionY, size, color) {
        return new Particle(x, y, directionX, directionY, size, color);
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.trunc((Math.random() * 5)) + 1;
        let x = ( Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2 );
        let y = ( Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2 );
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8C5523';

        particlesArray.push(Particle.create(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

init();
animate();

// class ParticlesLayout {
//     constructor() {
//         this.particlesArray = [];

//     }
// }