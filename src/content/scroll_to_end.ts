
export default class ScrollToEnd {
	enabled: boolean = true;

	scroll_to_end() {
		if (!this.enabled) {
			console.log("Stopping scrolling to end");
			return;
		}
		// still left to scroll
		if (document.documentElement.scrollTop < document.documentElement.scrollHeight - document.documentElement.clientHeight) {
			document.documentElement.scrollTop = document.documentElement.scrollHeight;

			setTimeout(this.scroll_to_end, 2000);
		}
	}
}
