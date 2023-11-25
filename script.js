const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    resetAtomsPositions();
});

const draw = (x, y, c, s) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, s, s);
};

let atoms = [];

const createAtom = (x, y, c) => {
    return { x, y, vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1, color: c };
};

const randomPosition = () => {
    return Math.random() * (innerWidth - 30) + 15;
};

const createAtoms = (number, color) => {
    let group = [];
    for (let i = 0; i < number; i++) {
        group.push(createAtom(randomPosition(), randomPosition(), color));
    }
    return group;
};

const resetAtomsPositions = () => {
    atoms = [];
    const red = createAtoms(100, "red");
    const blue = createAtoms(100, "blue");
    const white = createAtoms(100, "white");
    atoms.push(...red, ...blue, ...white);
};

const checkBoundaries = (atom) => {
    if (atom.x <= 0 || atom.x >= innerWidth - 5) {
        atom.vx *= -1;
    }
    if (atom.y <= 0 || atom.y >= innerHeight - 5) {
        atom.vy *= -1;
    }
};

const limitVelocity = (atom) => {
    const maxSpeed = 3;
    const speed = Math.sqrt(atom.vx ** 2 + atom.vy ** 2);
    if (speed > maxSpeed) {
        const ratio = maxSpeed / speed;
        atom.vx *= ratio;
        atom.vy *= ratio;
    }
};

const rules = () => {
    const k = 0.2; // Coulomb constant

    for (let i = 0; i < atoms.length; i++) {
        let fx = 0;
        let fy = 0;
        for (let j = 0; j < atoms.length; j++) {
            if (i !== j) {
                const a = atoms[i];
                const b = atoms[j];
                let dx = b.x - a.x;
                let dy = b.y - a.y;
                let distanceSquared = dx * dx + dy * dy;
                distanceSquared = Math.max(1, distanceSquared); // To avoid division by zero
                let F = (k / distanceSquared);
                fx += F * dx;
                fy += F * dy;
            }
        }

        atoms[i].vx += fx;
        atoms[i].vy += fy;
        atoms[i].x += atoms[i].vx;
        atoms[i].y += atoms[i].vy;

        checkBoundaries(atoms[i]);
        limitVelocity(atoms[i]);
    }
};

function update() {
    requestAnimationFrame(update);

    rules();

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < atoms.length; i++) {
        draw(atoms[i].x, atoms[i].y, atoms[i].color, 5);
    }
}

resetAtomsPositions();
update();
