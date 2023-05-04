import { sleep } from "./main";

export default class ScrollToEnd {
	enabled = true;
	private retry_count = 0;

	async scroll_to_end() {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (!this.enabled || this.retry_count > 60) {
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
				this.retry_count += 1;
			}

			await sleep(1);
		}
	}
}
