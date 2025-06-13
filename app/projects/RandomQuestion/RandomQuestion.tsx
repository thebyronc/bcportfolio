import { useState, useEffect } from "react";
import "./RandomQuestion.css";
import { animate, stagger } from "animejs";
import ListOfQuestions from "./ListOfQuestions";

export function RandomQuestion() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [isToggled, setIsToggled] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [question, setQuestion] = useState<string>("");

  const randomQuestion = () => {
    if (!isToggled) {
      const questions: string[] = ListOfQuestions;
      const randomIndex = Math.floor(Math.random() * questions.length);
      setQuestion(questions[randomIndex]);
    }
  };

  const toggle = () => {
    setIsToggled(!isToggled);
  };

  const triggerAnimation = (index: number) => {
    randomQuestion();
    toggle();
    animate(".tile", {
      opacity: isToggled ? 1 : 0,
      delay: stagger(50, {
        grid: [columns, rows],
        from: index,
      }),
    });
  };

  const createGrid = (columns: number, rows: number) => {
    return Array.from({ length: columns * rows }, (_, index) => (
      <div
        key={index}
        className={`tile z-2 bg-zinc-900 hover:bg-zinc-800`}
        onClick={() => triggerAnimation(index)}
      ></div>
    ));
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const size = windowDimensions.width > 800 ? 120 : 60;

    const newColumns = Math.floor(windowDimensions.width / size);
    const newRows = Math.floor(windowDimensions.height / size);

    setColumns(newColumns);
    setRows(newRows);
  }, [windowDimensions]);

  return (
    <main className={`animated-grid ${isToggled ? "toggled" : ""} z-1`}>
      <div
        id="tiles"
        style={{ "--columns": columns, "--rows": rows } as React.CSSProperties}
      >
        {createGrid(columns, rows)}
      </div>
      <div
        id="q-block"
        className="pointer-events-none absolute top-0 z-1 flex h-screen w-screen items-center justify-center py-16"
      >
        <h1
          id="question"
          className="pointer-events-none container m-0 text-center font-sans text-4xl font-bold text-white text-shadow-md text-shadow-zinc-950 sm:text-[4vw]"
        >
          {question}
          <span className="fancy text-[5vw]/[0px] text-teal-300">?</span>
        </h1>
      </div>
      <div
        id="i-block"
        className="pointer-events-none absolute top-0 z-3 flex h-screen w-screen items-center justify-center py-16"
      >
        <h1
          id="intructions"
          className="pointer-events-none container m-0 text-center font-sans text-6xl font-bold text-white text-shadow-md text-shadow-zinc-950 sm:text-[6vw]"
        >
          Click Any Square
          <span className="fancy text-8xl text-violet-700 sm:text-[8vw]">
            !
          </span>
        </h1>
      </div>
    </main>
  );
}
