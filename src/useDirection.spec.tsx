import { renderHook, act, HookResult } from "@testing-library/react-hooks";
import { useDirection, Directions, KeyCode } from "./useDirection";

jest.useFakeTimers();

describe("useDirection", () => {
  it("should get the right default direction: LEFT", () => {
    const { result } = renderHook(() => useDirection(Directions.LEFT));

    const [currentDirection] = result.current;
    expect(currentDirection).toBe(Directions.LEFT);
  });

  it("should get the right default direction: RIGHT", () => {
    const { result } = renderHook(() => useDirection(Directions.RIGHT));

    const [currentDirection] = result.current;
    expect(currentDirection).toBe(Directions.RIGHT);
  });

  it("should get the right default direction: UP", () => {
    const { result } = renderHook(() => useDirection(Directions.UP));

    const [currentDirection] = result.current;
    expect(currentDirection).toBe(Directions.UP);
  });

  it("should get the right default direction: DOWN", () => {
    const { result } = renderHook(() => useDirection(Directions.DOWN));

    const [currentDirection] = result.current;
    expect(currentDirection).toBe(Directions.DOWN);
  });

  describe("direction LEFT should change direction", () => {
    let result: HookResult<[Directions, (keyCode: number) => void]>;

    beforeEach(() => {
      let { result: currentResult } = renderHook(() =>
        useDirection(Directions.LEFT)
      );
      result = currentResult;
    });
    it("LEFT to UP", () => {
      expect(result.current[0]).toBe(Directions.LEFT);

      act(() => {
        result.current[1](KeyCode.UP);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.UP);
    });

    it("LEFT to DOWN", () => {
      expect(result.current[0]).toBe(Directions.LEFT);

      act(() => {
        result.current[1](KeyCode.DOWN);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.DOWN);
    });

    it("should fail in LEFT to RIGHT", () => {
      expect(result.current[0]).toBe(Directions.LEFT);

      act(() => {
        result.current[1](KeyCode.RIGHT);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.LEFT);
    });
  });

  describe("direction UP should change direction", () => {
    let result: HookResult<[Directions, (keyCode: number) => void]>;

    beforeEach(() => {
      let { result: currentResult } = renderHook(() =>
        useDirection(Directions.UP)
      );
      result = currentResult;
    });
    it("UP to RIGHT", () => {
      expect(result.current[0]).toBe(Directions.UP);

      act(() => {
        result.current[1](KeyCode.RIGHT);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.RIGHT);
    });

    it("UP to LEFT", () => {
      expect(result.current[0]).toBe(Directions.UP);

      act(() => {
        result.current[1](KeyCode.LEFT);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.LEFT);
    });

    it("should fail in UP to DOWN", () => {
      expect(result.current[0]).toBe(Directions.UP);

      act(() => {
        result.current[1](KeyCode.DOWN);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.UP);
    });
  });

  describe("direction RIGHT should change direction", () => {
    let result: HookResult<[Directions, (keyCode: number) => void]>;

    beforeEach(() => {
      let { result: currentResult } = renderHook(() =>
        useDirection(Directions.RIGHT)
      );
      result = currentResult;
    });
    it("RIGHT to UP", () => {
      expect(result.current[0]).toBe(Directions.RIGHT);

      act(() => {
        result.current[1](KeyCode.UP);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.UP);
    });

    it("RIGHT to DOWN", () => {
      expect(result.current[0]).toBe(Directions.RIGHT);

      act(() => {
        result.current[1](KeyCode.DOWN);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.DOWN);
    });

    it("should fail in RIGHT to LEFT", () => {
      expect(result.current[0]).toBe(Directions.RIGHT);

      act(() => {
        result.current[1](KeyCode.LEFT);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.RIGHT);
    });
  });

  describe("direction DOWN should change direction", () => {
    let result: HookResult<[Directions, (keyCode: number) => void]>;

    beforeEach(() => {
      let { result: currentResult } = renderHook(() =>
        useDirection(Directions.DOWN)
      );
      result = currentResult;
    });
    it("DOWN to LEFT", () => {
      expect(result.current[0]).toBe(Directions.DOWN);

      act(() => {
        result.current[1](KeyCode.LEFT);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.LEFT);
    });

    it("DOWN to RIGHT", () => {
      expect(result.current[0]).toBe(Directions.DOWN);

      act(() => {
        result.current[1](KeyCode.RIGHT);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.RIGHT);
    });

    it("should fail in DOWN to UP", () => {
      expect(result.current[0]).toBe(Directions.DOWN);

      act(() => {
        result.current[1](KeyCode.UP);
        jest.runAllTimers();
      });

      expect(result.current[0]).toBe(Directions.DOWN);
    });
  });
});
