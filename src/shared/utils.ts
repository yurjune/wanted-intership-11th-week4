export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 500,
): (...args: Params) => void {
  let timer: NodeJS.Timeout;

  return async (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}
