import React from "react";
import { useDebouncedCallback } from "use-debounce";

export enum Directions {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

export enum KeyCode {
  UP = 38,
  DOWN = 40,
  LEFT = 37,
  RIGHT = 39
}

export function useDirection(
  initialDirection: Directions,
  debounceTime = 1000 / 20
): [Directions, ((keyCode: KeyCode) => void)] {
  const [direction, setDirection] = React.useState(initialDirection);

  const keys = React.useMemo(() => {
    const proxyHandler = {
      get: function(obj: any, prop: number) {
        return prop in obj ? obj[prop] : () => null;
      }
    };

    const keysAndActions = {
      [KeyCode.LEFT]: (curDir: Directions) =>
        curDir !== Directions.RIGHT && setDirection(Directions.LEFT),
      [KeyCode.UP]: (curDir: Directions) =>
        curDir !== Directions.DOWN && setDirection(Directions.UP),
      [KeyCode.RIGHT]: (curDir: Directions) =>
        curDir !== Directions.LEFT && setDirection(Directions.RIGHT),
      [KeyCode.DOWN]: (curDir: Directions) =>
        curDir !== Directions.UP && setDirection(Directions.DOWN)
    };

    return new Proxy(keysAndActions, proxyHandler);
  }, []) as {
    [key: number]: (curDir: Directions) => void;
  };

  const [handleKeyPress] = useDebouncedCallback(
    React.useCallback((keyCode: KeyCode) => keys[keyCode](direction), [
      direction
    ]),
    debounceTime
  );

  return [direction, handleKeyPress];
}
