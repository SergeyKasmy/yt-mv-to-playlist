function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000 /* millis in a sec */));
}

function get_current_playlist() {
	const playlist_metadata = document.getElementsByClassName("metadata-wrapper")[0];	// only one
	const playlist_name = playlist_metadata.getElementsByClassName("yt-dynamic-sizing-formatted-string")[0].textContent;	// dunno what [1] is

	return playlist_name.trim();
}

let STOPPED = true;
async function move_videos(current_playlist, target_playlist) {
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
	for (video of document.getElementsByTagName("ytd-playlist-video-renderer")) {
		if (STOPPED) {
			console.log("Aborting early");
			return;
		}

		console.log("Processing video #" + i);
		video.getElementsByTagName("button").button.click();
		console.log("Pressed the menu button");
		await sleep(0.2);
		for (save_to_playlist_button of document.getElementsByTagName("tp-yt-paper-item")) {
			if (save_to_playlist_button.textContent.indexOf("Save to playlist") == -1) {
				continue;
			}
			
			save_to_playlist_button.click();
			console.log("Pressed save to playlist button");
			await sleep(2.5);
			
			for (playlist of document.getElementById("playlists").getElementsByTagName("yt-formatted-string")) {
				if (playlist.textContent == target_playlist) {
					playlist.click();
					console.log("Adding to", target_playlist);
					await sleep(0.2);
					continue;
				} else if (playlist.textContent == current_playlist) {
					playlist.click();
					console.log("Removing from", current_playlist);
					await sleep(0.2);
					continue;
				}

			}
		}
		
		document.getElementById("close-button").click();
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

browser.runtime.onMessage.addListener((message) => {
	console.log("Received message", message);
	switch (message.action) {
		case "move_videos":
		{
			console.log("Received message move_videos");
				
			STOPPED = !STOPPED;
			const current_playlist = get_current_playlist();
			console.log("current_playlist is", current_playlist);
			console.log("Calling move_videos" + "(" + current_playlist + ", " + message.target_playlist + ")");
			move_videos(current_playlist, message.target_playlist);

			break;
		}
		case "scroll_to_end":
			scroll_to_end();
			break;
	}
});
