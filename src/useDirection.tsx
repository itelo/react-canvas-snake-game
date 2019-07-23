import React from "react";
import { useDebouncedCallback } from "use-debounce";

export enum Directions {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

export function useDirection(
  initialDirection: Directions,
  debounceTime = 1000 / 20
): [Directions, ((keyCode: number) => void)] {
  const [direction, setDirection] = React.useState(initialDirection);

  const keys = React.useMemo(
    () => ({
      37: (curDir: Directions) =>
        curDir !== Directions.RIGHT && setDirection(Directions.LEFT),
      38: (curDir: Directions) =>
        curDir !== Directions.DOWN && setDirection(Directions.UP),
      39: (curDir: Directions) =>
        curDir !== Directions.LEFT && setDirection(Directions.RIGHT),
      40: (curDir: Directions) =>
        curDir !== Directions.UP && setDirection(Directions.DOWN)
    }),
    []
  ) as {
    [key: number]: (curDir: Directions) => void;
  };

  const [handleKeyPress] = useDebouncedCallback(
    React.useCallback(
      (keyCode: number) => {
        console.log(keyCode);
        if (keys[keyCode]) {
          keys[keyCode](direction);
        }
      },
      [direction]
    ),
    debounceTime
  );

  return [direction, handleKeyPress];
}
