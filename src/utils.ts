export function sleep(s: number) {
	return new Promise((resolve) =>
		setTimeout(resolve, s * 1000 /* millis in a sec */)
	);
}

export function throwExpr(msg: string): never {
	throw new Error(msg);
}

export function assertIsButton(elem: Element): asserts elem is HTMLButtonElement {
	if (!(elem instanceof HTMLElement)) {
		throw new Error("Element isn't pressible");
	}
}
