// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    // eslint-disable-next-line @typescript-eslint/@typescript-eslint/no-explicit-any
    return function (...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };