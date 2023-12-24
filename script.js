const canvas = document.getElementById('matrixCanvas');
const context = canvas.getContext('2d');

let fontSize = 16;
let drops = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const columns = canvas.width / fontSize;
  drops = [];

  for (let x = 0; x < columns; x++)
    drops[x] = 1;
}

function draw() {
  context.fillStyle = 'rgba(0, 0, 0, 0.05)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#21D400'; // Green color
  context.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+=-{}[]|;:'<>,.?/".charAt(Math.floor(Math.random() * symbols.length));
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

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Initialize the effect
init();
