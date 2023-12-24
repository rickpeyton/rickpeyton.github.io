const canvas = document.getElementById('matrixCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 16;
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+=-{}[]|;:'<>,.?/";
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++)
  drops[x] = 1;

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

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops.length = canvas.width / fontSize;
  for (let x = 0; x < drops.length; x++)
    drops[x] = 1;
}

window.addEventListener('resize', resizeCanvas);

init();
