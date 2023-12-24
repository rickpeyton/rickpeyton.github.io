const canvas = document.getElementById('matrixCanvas');
const context = canvas.getContext('2d');

const fontSize = 16;
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+=-{}[]|;:'<>,.?/";
let drops = [];

function resetDrops(columns) {
    // Extend or trim the drops array based on the new column count
    const newDrops = new Array(columns).fill(1);
    for (let i = 0; i < Math.min(drops.length, columns); i++) {
        newDrops[i] = drops[i];
    }
    drops = newDrops;
}

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    context.scale(pixelRatio, pixelRatio);

    const columns = Math.floor(canvas.width / fontSize);
    resetDrops(columns);
}

function draw() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#21D400'; // Green color
    context.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = symbols.charAt(Math.floor(Math.random() * symbols.length));
        context.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
            drops[i] = 0;

        drops[i]++;
    }
}

function init() {
    resizeCanvas();
    setInterval(draw, 33);
}

window.addEventListener('resize', resizeCanvas);

init();
