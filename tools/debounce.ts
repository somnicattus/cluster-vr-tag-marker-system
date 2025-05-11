/**
 * Creates a debounced function that delays invoking the provided function until
 * after the specified delay time has passed since the last time the debounced function was invoked.
 *
 * @template P - The type of the parameters passed to the function.
 * @param fn - The function to debounce.
 * @param delay - The time to delay. The unit must be the same as the unit of the `deltaTime`.
 * @returns A debounced function that accumulates the `deltaTime` and invokes the original function
 *          when the accumulated time exceeds the specified delay.
 */
export const debounce = (
  fn: (deltaTime: number) => void,
  delay: number,
): ((deltaTime: number) => void) => {
  let accumulatedTime = 0;

  return (deltaTime: number) => {
    accumulatedTime += deltaTime;

    if (accumulatedTime >= delay) {
      fn(deltaTime);
      accumulatedTime = 0;
    }
  };
};
