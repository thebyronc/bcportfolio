import { useState } from "react";
import "./RandomQuestion.css";
import { animate, createScope, createSpring, createDraggable } from "animejs";

export function RandomQuestion() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [isToggled, setIsToggled] = useState(false);

  const toggle = () => {
    setIsToggled(!isToggled);
  };

  // const handleOnClick = (index) => {
  //   toggle();

  //   animate({
  //     targets: ".tile",
  //     opacity: isToggled ? 0 : 1,
  //     delay: animate.stagger(50, {
  //       grid: [columns, rows],
  //       from: index,
  //     }),
  //   });
  // };

  // const createTile = (index) => {
  //   const tile = <div className={`tile ${isToggled ? 'opacity-0' : 'opacity-100'}`}></div>;

  //   tile.style.opacity = toggled ? 0 : 1;

  //   tile.onclick = (e) => handleOnClick(index);

  //   return tile;
  // };

  // const createGrid = () => {
  //   // wrapper.innerHTML = "";

  //   const size = document.body.clientWidth > 800 ? 100 : 50;

  //   const columns = Math.floor(document.body.clientWidth / size);
  //   const rows = Math.floor(document.body.clientHeight / size);

  //   wrapper.style.setProperty("--columns", columns);
  //   wrapper.style.setProperty("--rows", rows);

  //   createTiles(columns * rows);
  // };

  return (
    <div className={isToggled ? "toggled" : ""}>
      <div id="tiles"></div>
    </div>
  );
}
