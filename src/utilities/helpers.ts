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
