// Refactored and enhanced Chalkboard App

document.addEventListener("DOMContentLoaded", chalkboard);

function chalkboard() {
  const channel = new BroadcastChannel("buddypond-desktop");
  channel.postMessage({ type: "app", app: "chalkboard", action: "open" });
  channel.onmessage = (event) => console.log("chalkboard received:", event.data);

  cleanupExistingElements();
  createUI();

  const canvas = document.getElementById("chalkboard");
  const ctx = canvas.getContext("2d");
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;
  let mouseX = 0, mouseY = 0, mouseD = false, eraser = false;
  let xLast = 0, yLast = 0;
  let chalkColor = "rgba(255,255,255,0.5)";
  const brushDiameter = 7;
  const eraserWidth = 50;
  const eraserHeight = 100;

  const chalk = document.querySelector(".chalk");
  const patImg = document.getElementById("pattern");

  canvas.style.cursor = "none";
  document.onselectstart = () => false;
  ctx.lineCap = "round";
  ctx.lineWidth = brushDiameter;

  // Event handlers
  document.addEventListener("touchmove", handleTouchMove, false);
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchend", () => (mouseD = false), false);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keyup", handleKeyUp);
  document.oncontextmenu = () => false;

  document.querySelector(".link").addEventListener("click", saveImage);
  document.getElementById("clearBtn").addEventListener("click", () => ctx.clearRect(0, 0, width, height));
  document.getElementById("colorPicker").addEventListener("change", (e) => (chalkColor = hexToRGBA(e.target.value)));

  function handleTouchMove(evt) {
    const touch = evt.touches[0];
    mouseX = touch.pageX;
    mouseY = touch.pageY;
    if (mouseY < height && mouseX < width) {
      evt.preventDefault();
      moveChalk(mouseX, mouseY);
      if (mouseD) draw(mouseX, mouseY);
    }
  }

  function handleTouchStart(evt) {
    const touch = evt.touches[0];
    mouseD = true;
    xLast = mouseX = touch.pageX;
    yLast = mouseY = touch.pageY;
    draw(mouseX + 1, mouseY + 1);
  }

  function handleMouseMove(evt) {
    mouseX = evt.pageX;
    mouseY = evt.pageY;
    if (mouseY < height && mouseX < width) {
      moveChalk(mouseX, mouseY);
      if (mouseD) eraser ? erase(mouseX, mouseY) : draw(mouseX, mouseY);
    } else chalk.style.top = height - 10 + "px";
  }

  function handleMouseDown(evt) {
    mouseD = true;
    xLast = mouseX;
    yLast = mouseY;
    if (evt.button === 2) {
      eraser = true;
      chalk.classList.add("eraser");
      erase(mouseX, mouseY);
    } else if (!evt.target.closest(".panel")) {
      draw(mouseX + 1, mouseY + 1);
    }
  }

  function handleMouseUp(evt) {
    mouseD = false;
    if (evt.button === 2) {
      eraser = false;
      chalk.classList.remove("eraser");
    }
  }

  function handleKeyUp(evt) {
    if (evt.keyCode === 32) ctx.clearRect(0, 0, width, height);
    if (evt.keyCode === 83) changeLink();
  }

  function moveChalk(x, y) {
    chalk.style.left = x - brushDiameter / 2 + "px";
    chalk.style.top = y - brushDiameter / 2 + "px";
  }

  function draw(x, y) {
    ctx.strokeStyle = chalkColor.replace(/\d?\.?\d+\)$/g, `${0.4 + Math.random() * 0.2})`);
    ctx.beginPath();
    ctx.moveTo(xLast, yLast);
    ctx.lineTo(x, y);
    ctx.stroke();

    const length = Math.round(
      Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) / (5 / brushDiameter)
    );
    const xUnit = (x - xLast) / length;
    const yUnit = (y - yLast) / length;
    for (let i = 0; i < length; i++) {
      const xCurrent = xLast + i * xUnit;
      const yCurrent = yLast + i * yUnit;
      const xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      const yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }
    xLast = x;
    yLast = y;
  }

  function erase(x, y) {
    ctx.clearRect(x - eraserWidth / 2, y - eraserHeight / 2, eraserWidth, eraserHeight);
  }

  function saveImage() {
    const downloadEl = document.querySelector(".download");
    if (downloadEl) downloadEl.remove();

    const imgCanvas = document.createElement("canvas");
    const imgCtx = imgCanvas.getContext("2d");
    imgCanvas.width = width;
    imgCanvas.height = height;
    imgCtx.fillStyle = imgCtx.createPattern(patImg, "repeat");
    imgCtx.fillRect(0, 0, width, height);

    const layimage = new Image();
    layimage.src = canvas.toDataURL("image/png");
    setTimeout(() => {
      imgCtx.drawImage(layimage, 0, 0);
      const compimage = imgCanvas.toDataURL("image/png");
      channel.postMessage({
        type: "app",
        app: "chalkboard",
        action: "save",
        image: compimage,
        timestamp: Date.now()
      });
    }, 500);
  }

  function changeLink() {
    // Placeholder for existing logic
  }

  function hexToRGBA(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},0.5)`;
  }

  function cleanupExistingElements() {
    ["chalkboard", "pattern"].forEach((id) => document.getElementById(id)?.remove());
    document.querySelector(".chalk")?.remove();
  }

  function createUI() {
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `
      <a class="link" target="_blank">Save</a>
      <button id="clearBtn">Clear</button>
      <input type="color" id="colorPicker" value="#ffffff" title="Pick Chalk Color">
    `;
    document.body.prepend(panel);

    const pattern = document.createElement("img");
    pattern.src = "img/bg.png";
    pattern.id = "pattern";
    pattern.width = 50;
    pattern.height = 50;
    document.body.prepend(pattern);

    const canvas = document.createElement("canvas");
    canvas.id = "chalkboard";
    document.body.prepend(canvas);

    const chalkDiv = document.createElement("div");
    chalkDiv.className = "chalk";
    document.body.prepend(chalkDiv);
  }

  window.addEventListener("resize", () => {
    // Optional: implement dynamic resizing
  });
}