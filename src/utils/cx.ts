/**
 * A utility function to conditionally join CSS class names together.
 * Similar to the `classnames` or `clsx` packages.
 *
 * @param {...any} args - One or more class names or objects of class names
 * @returns {string} - The combined class names
 */
export function cx(...args: (string | undefined)[]) {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cx(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString === Object.prototype.toString) {
        for (const key in arg) {
          if (Object.hasOwnProperty.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  });

  return classes.join(' ');
}
