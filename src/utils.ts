export function sleep(s: number) {
	return new Promise((resolve) =>
		setTimeout(resolve, s * 1000 /* millis in a sec */)
	);
}

export function throwExpr(msg: string): never {
	throw new Error(msg);
}

export function throwWrongTypeError(varName: string, value: unknown, expectedType: string): never {
	let errorStr = "";

	if (
		typeof value === "object" &&
		value != null
	) {
		errorStr = ": " + JSON.stringify(value);
	} else if (value == null) {
		errorStr = ": null";
	}

	throw new Error(
		`${varName} response isn't of type ${expectedType}${errorStr}`
	);
}
