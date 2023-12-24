const canvas = document.getElementById('matrixCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 12;
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+=-{}[]|;:'<>,.?/";
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++)
  drops[x] = 1;

function draw() {
  context.fillStyle = 'rgba(0, 0, 0, 0.05)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#21D400';
  context.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = symbols.charAt(Math.floor(Math.random() * symbols.length));
    context.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height)
      drops[i] = 0;

    drops[i]++;
  }
}


function init() {
  resizeCanvas();
  setInterval(draw, 50);
}

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  context.scale(pixelRatio, pixelRatio);

  // Safeguard to ensure columns is a valid number
  const columns = Math.floor(canvas.width / fontSize);
  if (columns > 0 && Number.isFinite(columns)) {
    drops.length = columns;
    for (let x = 0; x < columns; x++)
      drops[x] = 1;
  }
}

window.addEventListener('resize', resizeCanvas);

init();
