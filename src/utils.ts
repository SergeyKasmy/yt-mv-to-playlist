export function sleep(s: number) {
	return new Promise((resolve) =>
		setTimeout(resolve, s * 1000 /* millis in a sec */)
	);
}

export function throwExpr(msg: string): never {
	throw new Error(msg);
}
