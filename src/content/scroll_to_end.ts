import { sleep } from "../utils.ts";

export default class ScrollToEnd {
	running = true;
	private retryCount = 0;

	async scrollToEnd() {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (!this.running || this.retryCount > 60) {
				console.log("Stopping scrolling to end");
				return;
			}
			// still left to scroll
			if (
				document.documentElement.scrollTop <
				document.documentElement.scrollHeight -
					document.documentElement.clientHeight
			) {
				document.documentElement.scrollTop =
					document.documentElement.scrollHeight;
			} else {
				this.retryCount += 1;
			}

			await sleep(1);
		}
	}
}
