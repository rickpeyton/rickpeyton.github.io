const canvas = document.getElementById('matrixCanvas');
const context = canvas.getContext('2d');

const fontSize = 16;
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+=-{}[]|;:'<>,.?/";

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  context.scale(pixelRatio, pixelRatio);

  const columns = Math.floor(canvas.width / fontSize);
  const prevDropsLength = drops.length;

  // Resize drops array while preserving existing values
  drops.length = columns;
  for (let x = prevDropsLength; x < columns; x++)
    drops[x] = 1;
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

// Initialize drops array
const drops = Array(Math.floor(canvas.width / fontSize)).fill(1);

window.addEventListener('resize', resizeCanvas);

init();
