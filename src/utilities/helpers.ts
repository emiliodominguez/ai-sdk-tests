/**
 * Check if the current environment is a browser
 * @returns Whether the current environment is a browser
 */
export function isBrowser(): boolean {
	return typeof window !== "undefined";
}

/**
 * Generates a random ID
 * @returns A random ID
 */
export function generateRandomId(): number {
	return Math.floor(Math.random() * 1e6);
}

/**
 * A helper function to handle class name conditions easily.
 * Receives an object containing strings or an object with the CSS class as key
 * and a condition to add or remove it as value.
 * @param classNames - The classnames object
 * @returns The classes separated by a space
 */
export function className(...classNames: Array<string | undefined | null | { [key: string]: boolean }>): { className: string } {
	const classes = [];

	for (const _className of classNames) {
		if (typeof _className === "object") {
			for (const key in _className) {
				if (_className[key]) {
					classes.push(key);
				}
			}
		} else {
			classes.push(_className);
		}
	}

	return { className: classes.join(" ") };
}
