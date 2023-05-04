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

function move_videos() {
	browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id, {
			action: "move_videos",
			target_playlist: document.getElementById("target_playlist_name_input_text").value,
		});
	});
}

function scroll_to_end() {
	browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
		browser.tabs.sendMessage(tabs[0].id, { action: "scroll_to_end" });
	});
}

document.addEventListener("click", (event) => {
	console.log("Handling a click");
	if (event.target.id === "move_videos_button") {
		console.log("Clicked move_videos_button");

		move_videos();
	} else if (event.target.id === "scroll_to_end_button") {
		console.log("Clicked scroll_to_end_button");

		scroll_to_end();
	} else {
		console.log("Clicked something but not a button");
	}
});
