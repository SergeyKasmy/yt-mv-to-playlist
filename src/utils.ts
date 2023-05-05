export function sleep(s: number) {
	return new Promise((resolve) =>
		setTimeout(resolve, s * 1000 /* millis in a sec */)
	);
}

export function throw_expr(msg: string): never {
	throw new Error(msg);
}
