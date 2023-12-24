const canvas = document.getElementById('matrixCanvas');
const context = canvas.getContext('2d');

let fontSize = 16;
let drops = [];
let mouseX = 0, mouseY = 0;

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

  for (let i = 0; i < drops.length; i++) {
    let distance = Math.sqrt(Math.pow(i - mouseX / fontSize, 2) + Math.pow(drops[i] - mouseY / fontSize, 2));
    let speedMultiplier = Math.max(100 / (distance + 1), 1);

    if (distance < 10) {
      context.fillStyle = '#FFFFFF'; // Highlight color
    } else {
      context.fillStyle = '#21D400'; // Normal color
    }

    const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+=-{}[]|;:'<>,.?/".charAt(Math.floor(Math.random() * symbols.length));
    context.fillText(text, i * fontSize, drops[i] * fontSize);

    drops[i] += speedMultiplier * 0.05;

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
      drops[i] = 0;
  }
}

function init() {
  resizeCanvas();
  setInterval(draw, 33);
}

window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousemove', function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

init();
