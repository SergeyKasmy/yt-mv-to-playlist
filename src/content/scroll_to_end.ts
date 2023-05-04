export default function scroll_to_end() {
	// still left to scroll
	if (document.documentElement.scrollTop < document.documentElement.scrollHeight - document.documentElement.clientHeight) {
		document.documentElement.scrollTop = document.documentElement.scrollHeight;

		setTimeout(scroll_to_end, 2000);
	}
}
