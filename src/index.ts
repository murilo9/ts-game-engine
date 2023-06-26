import pepeImg from "./assets/pepe.png";

const canvas = document.createElement("canvas");
canvas.id = "game-canvas";
canvas.width = 800;
canvas.height = 600;
canvas.style.background = "#CCCCCC";

const image = new Image();

document.body.appendChild(canvas);

image.src = pepeImg;
image.addEventListener(
  "load",
  () => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, 100, 100);
  },
  false
);
