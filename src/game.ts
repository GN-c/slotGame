import Game from "./Game/index";

window.addEventListener("load", () => {
  const game = new Game(document.getElementById("parent")! as HTMLDivElement);
});
