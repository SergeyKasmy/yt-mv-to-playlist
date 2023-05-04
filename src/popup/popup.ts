import browser from "webextension-polyfill";
import Action from "../action.ts";

function send_message_to_open_tab(payload: Action) {
	browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
		const selected_tab_id = tabs[0]?.id;
		if (selected_tab_id == null) return;
		browser.tabs.sendMessage(selected_tab_id, payload);
	});
}

function move_videos() {
	const target_playlist = (
		document.getElementById(
			"target_playlist_name_input_text"
		) as HTMLInputElement
	)?.value;
	if (target_playlist == null) return;
	send_message_to_open_tab({
		action: "move_videos",
		target_playlist: target_playlist,
	});
}

function scroll_to_end() {
	send_message_to_open_tab({
		action: "scroll_to_end",
	});
}

document.addEventListener("click", (event) => {
	console.log("Handling a click");

	if (event.target == null) return;
	const target = event.target as HTMLElement;

	if (target.id === "move_videos_button") {
		console.log("Clicked move_videos_button");

		move_videos();
	} else if (target.id === "scroll_to_end_button") {
		console.log("Clicked scroll_to_end_button");

		scroll_to_end();
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
