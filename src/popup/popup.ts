import browser from "webextension-polyfill";
import { Action, RunningStatus } from "../action.ts";
import { throw_expr } from "../content/main.ts";

// Send null if just to request running status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function send_message(action: Action | null): Promise<RunningStatus> {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	const selected_tab_id = tabs[0]?.id ?? throw_expr("Active tab has no ID");
	return browser.tabs.sendMessage(selected_tab_id, action);
}

async function move_videos(): Promise<RunningStatus | null> {
	const target_playlist = (
		document.getElementById(
			"target_playlist_name_input_text"
		) as HTMLInputElement
	)?.value;
	if (target_playlist == null) return null;

	return send_message({
		action: "move_videos",
		target_playlist: target_playlist,
	});
}

async function scroll_to_end(): Promise<RunningStatus> {
	return send_message({
		action: "scroll_to_end",
	});
}

function update_button_running_caption(status: RunningStatus) {
	const move_videos_button =
		document.getElementById("move_videos_button") ??
		throw_expr("move_videos_button not found");
	move_videos_button.textContent = status.move_videos_running
		? "Stop moving videos"
		: "Move videos";

	const scroll_to_end_button =
		document.getElementById("scroll_to_end_button") ??
		throw_expr("scroll_to_end_button not found");
	scroll_to_end_button.textContent = status.scroll_to_end_running
		? "Stop scrolling to end"
		: "Scroll to end";
}

send_message(null).then((status) => update_button_running_caption(status));
document.addEventListener("click", (event) => {
	console.log("Handling a click");

	if (event.target == null || !(event.target instanceof HTMLElement)) return;

	if (event.target.id === "move_videos_button") {
		console.log("Clicked move_videos_button");

		move_videos().then((status) => {
			if (status == null) return;
			update_button_running_caption(status);
		});
	} else if (event.target.id === "scroll_to_end_button") {
		console.log("Clicked scroll_to_end_button");

		scroll_to_end().then((status) => update_button_running_caption(status));
	} else {
		console.log("Clicked something but not a button");
	}
});

/*
function get_all_playlists() {
	const channel = browser.runtime.connect();

	browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id, { action: "get_all_playlists", channel: channel });
	});

	channel.onMessage.addListener((playlists) => {
		for (const playlist of playlists) {
			const playlist_elem = document.createElement("option");
			playlist_elem.text = playlist;
			document.getElementById("playlist_select").appendChild(playlist_elem);
		}
	});
}
*/
