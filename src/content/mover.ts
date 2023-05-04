import { Action } from "../action.ts";

function sleep(s: number) {
    return new Promise(resolve => setTimeout(resolve, s * 1000 /* millis in a sec */));
}

function is_button(elem: Element): asserts elem is HTMLButtonElement {
	if (!(elem instanceof HTMLButtonElement)) {
		throw new Error("Button isn't an actual button??");
	}
}

function throw_expr(msg: string): never {
	throw new Error(msg);
}

function get_current_playlist(): string {
	const playlist_metadata = document.getElementsByClassName("metadata-wrapper")[0];	// only one
	const playlist_name = playlist_metadata.getElementsByClassName("yt-dynamic-sizing-formatted-string")[0].textContent;	// dunno what [1] is

	return playlist_name?.trim() ?? throw_expr("Current playlist name is null");
}

let STOPPED = true;
async function move_videos(current_playlist: string, target_playlist: string) {
	console.log("Moving from", current_playlist, "to", target_playlist);
	if (current_playlist == "") {
		console.error("Current playlist name is empty");
		return;
	}
	if (target_playlist == "") {
		alert("Target playlist name is empty");
		return;
	}

	let i = 0;
	for (const video of document.getElementsByTagName("ytd-playlist-video-renderer")) {
		if (STOPPED) {
			console.log("Aborting early");
			return;
		}

		console.log("Processing video #" + i);
		video.getElementsByTagName("button")[0].click();	// only one button should exist
		console.log("Pressed the menu button");
		await sleep(0.2);
		for (const save_to_playlist_button of document.getElementsByTagName("tp-yt-paper-item")) {
			is_button(save_to_playlist_button);

			if (save_to_playlist_button.textContent?.indexOf("Save to playlist") == -1) {
				continue;
			}
			
			save_to_playlist_button.click();
			console.log("Pressed save to playlist button");
			await sleep(2.5);
			
			const playlists = document.getElementById("playlists")?.getElementsByTagName("yt-formatted-string") ?? throw_expr("Playlists not found");

			for (const playlist of playlists) {
				is_button(playlist);

				if (playlist.textContent === target_playlist) {
					playlist.click();
					console.log("Adding to", target_playlist);
					await sleep(0.2);
					continue;
				} else if (playlist.textContent === current_playlist) {
					playlist.click();
					console.log("Removing from", current_playlist);
					await sleep(0.2);
					continue;
				}

			}
		}
		
		const close_button = document.getElementById("close-button") ?? throw_expr("Close button not found");
		is_button(close_button);
		close_button.click();
		console.log("Clicked the close save to playlist button");
		await sleep(0.2);

		i += 1;
	}

	alert("Done moving videos");
}

function scroll_to_end() {
	// still left to scroll
	if (document.documentElement.scrollTop < document.documentElement.scrollHeight - document.documentElement.clientHeight) {
		document.documentElement.scrollTop = document.documentElement.scrollHeight;

		setTimeout(scroll_to_end, 2000);
	}
}

browser.runtime.onMessage.addListener((action: Action) => {
	console.log("Received action", action);
	switch (action.action) {
		case "move_videos":
		{
			console.log("Received message move_videos");
				
			STOPPED = !STOPPED;
			const current_playlist = get_current_playlist();
			console.log("current_playlist is", current_playlist);
			console.log("Calling move_videos" + "(" + current_playlist + ", " + action.target_playlist + ")");
			move_videos(current_playlist, action.target_playlist);

			break;
		}
		case "scroll_to_end":
			scroll_to_end();
			break;
	}
});