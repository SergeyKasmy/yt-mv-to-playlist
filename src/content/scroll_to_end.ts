import { sleep } from "../utils.ts";

export default class ScrollToEnd {
	running = true;

	async scrollToEnd() {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (!this.running) {
				console.log("Stopping scrolling to end");
				return;
			}
			// still left to scroll
			if (
				document.documentElement.scrollTop ==
				document.documentElement.scrollHeight -
					document.documentElement.clientHeight
			) {
				// if spinner not hidden, i.e. not loading
				if (document.getElementById("spinner")?.ariaHidden !== "true") {
					console.log("Scrolled to end");
					this.running = false;
					return;
				}
			}

			document.documentElement.scrollTop =
				document.documentElement.scrollHeight;
			await sleep(1);
		}
	}
}
