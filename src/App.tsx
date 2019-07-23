import React, { useCallback } from "react";
import "./App.css";
import * as R from "ramda";
import { useDirection, Directions } from "./useDirection";

const createTable = (to: number) => R.range(0, to);

// enum Directions {
//   UP = "UP",
//   DOWN = "DOWN",
//   LEFT = "LEFT",
//   RIGHT = "RIGHT"
// }

const useAnimationFrame = (callback: any) => {
  let callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = () => {
    frameRef.current = requestAnimationFrame(loop);
    const cb = callbackRef.current;
    cb();
  };

  let frameRef = React.useRef() as React.MutableRefObject<number>;

  React.useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      return cancelAnimationFrame(frameRef.current);
    };
  }, []);
};

// type Moves = {
//   [key: Directions]: (pos: number) => number;
// };

const getRandomPosition = (widthCanvas: number, heightCanvas: number) =>
  Math.floor(Math.random() * widthCanvas * heightCanvas);

const App: React.FC = () => {
  // const [width, setWidth] = React.useState(100);
  // const [height, setHeight] = React.useState(100);
  const [widthCanvas, setWidthCanvas] = React.useState(25);
  const [heightCanvas, setHeightCanvas] = React.useState(25);

  const [foodPosition, setFoodPosition] = React.useState(
    getRandomPosition(widthCanvas, heightCanvas)
  );
  const [foodCounter, setFoodCounter] = React.useState(0);
  const [specialFood, setSpecialFood] = React.useState(false);
  const [specialFoodPosition, setSpecialFoodPosition] = React.useState(
    getRandomPosition(widthCanvas, heightCanvas)
  );

  const [points, setPoints] = React.useState(0);
  const [speed, setSpeed] = React.useState(9);

  const [table, setTable] = React.useState(
    createTable(widthCanvas * heightCanvas)
  );

  let intervalId = React.useRef(0).current;

  const [pixelSize, setPixelSize] = React.useState(20);
  const [snake, setSnake] = React.useState([1]);

  const [currentDirection, handleKeyPress] = useDirection(Directions.LEFT);
  const updateRate = 1000 / 60;
  const positionUpdateRate = 1000 / 20;

  React.useEffect(() => {
    const newTable = createTable(widthCanvas * heightCanvas);
    setTable(newTable);
  }, [widthCanvas, heightCanvas]);

  const canvas = React.useRef(null) as React.RefObject<HTMLCanvasElement>;

  const getRow = (pos: number) => Math.floor(pos / widthCanvas);
  const getNextRow = (dir: Directions, row: number) => {
    if (dir === Directions.DOWN) return row === heightCanvas - 1 ? 0 : row + 1;
    return row === 0 ? heightCanvas - 1 : row - 1;
  };
  const moves = {
    UP: (pos: number) =>
      (pos % widthCanvas) +
      getNextRow(currentDirection, getRow(pos)) * widthCanvas,
    DOWN: (pos: number) =>
      (pos % widthCanvas) +
      getNextRow(currentDirection, getRow(pos)) * widthCanvas,
    RIGHT: (pos: number) =>
      ((pos + 1) % widthCanvas) + getRow(pos) * widthCanvas,
    LEFT: (pos: number) =>
      pos % widthCanvas === 0
        ? widthCanvas - 1 + getRow(pos) * widthCanvas
        : pos - 1
  };

  const getNextFoodPosition = (snake: number[]): number => {
    const newFoodPosition = Math.floor(Math.random() * table.length);

    if (snake.includes(newFoodPosition)) {
      return getNextFoodPosition(snake);
    }

    return newFoodPosition;
  };

  const updateFood = React.useCallback(() => {
    const newFoodPosition = getNextFoodPosition(snake);
    setFoodPosition(newFoodPosition);
    if ((foodCounter + 1) % 2 === 0 && !specialFood) {
      setSpecialFood(true);
      setSpecialFoodPosition(getRandomPosition(widthCanvas, heightCanvas));
    }
    setFoodCounter(foodCounter + 1);
  }, [snake]);

  React.useEffect(() => {
    if (specialFood) {
      intervalId = window.setTimeout(() => {
        setSpecialFood(false);
      }, 10000);
    }

    return () => clearInterval(intervalId);
  }, [specialFood]);

  const updateSnake = () => {
    const snakeHead = snake[0];
    const ateFood = snakeHead === foodPosition;
    const ateSpecialFood = specialFood && snakeHead === specialFoodPosition;
    const snakeBodyOffset = ateFood ? 0 : -1;

    const snakeBody = R.slice(0, snake.length + snakeBodyOffset, snake);

    const newSnakeHead = moves[currentDirection](snakeHead);
    if (snakeBody.includes(newSnakeHead)) {
      alert("MORREU!");
      window.location.reload();
    }
    const newSnake = R.concat([newSnakeHead], snakeBody);
    setSnake(newSnake);

    return [ateFood, ateSpecialFood];
  };

  const updateGame = () => {
    let [ateFood, ateSpecialFood] = updateSnake();
    if (ateFood) {
      setPoints(points + speed);
      updateFood();
    }

    if (ateSpecialFood) {
      setPoints(points + 181);
      setSpecialFood(false);
    }

    // setSnake(R.map<number, number>(moves[direction])(snake))
  };

  // ATUALIZAR POSIÇÃO
  React.useEffect(() => {
    setTimeout(updateGame, positionUpdateRate);
  }, [snake]);

  // React.useEffect(() => {
  //   requestAnimationFrame(paint);
  //   // setInterval(updateFrame, updateRate);
  // }, []);

  const paint = React.useCallback(() => {
    // console.log("called");
    // const ctx = canvas.current;
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        table.forEach((_, index) => {
          ctx.fillStyle = snake.includes(index) ? "white" : "black";
          ctx.fillRect(
            // FUCK CANCAS X Y
            pixelSize * (index % widthCanvas),
            pixelSize * Math.floor(index / widthCanvas),
            pixelSize,
            pixelSize
          );
        });

        // render food
        ctx.fillStyle = "white";
        ctx.fillRect(
          // FUCK CANCAS X Y
          pixelSize * (foodPosition % widthCanvas),
          pixelSize * Math.floor(foodPosition / widthCanvas),
          pixelSize,
          pixelSize
        );

        if (specialFood) {
          ctx.fillStyle = "red";
          ctx.fillRect(
            pixelSize * (specialFoodPosition % widthCanvas),
            pixelSize * Math.floor(specialFoodPosition / widthCanvas),
            pixelSize,
            pixelSize
          );
        }
      }
    }

    // paint();
  }, [snake]);

  // ATUALIZAR JOGO
  useAnimationFrame(paint);

  // React.useEffect(() => {
  //   setWidth(window.innerWidth);
  //   setHeight(window.innerHeight);
  // }, []);

  // <div
  // onKeyDown={handleKeyPress}
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <canvas
        tabIndex={0}
        ref={canvas}
        width={widthCanvas * pixelSize}
        height={heightCanvas * pixelSize}
        onKeyDown={e => handleKeyPress(e.keyCode)}
      />
      <h1>{points}</h1>
    </div>
  );
};
// /</canvas></div>
// {/*  */}
export default App;
