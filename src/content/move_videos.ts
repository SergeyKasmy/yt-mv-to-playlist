import { sleep, throwExpr } from "../utils.ts";

export default class MoveVideos {
	running = true;
	private current_video_idx = 0;

	// TODO: keep current and target playlists inside the MoveVideos class.
	// This makes it easier to retrieve them to show in the popup later
	async moveVideos(
		currentPlaylist: string,
		targetPlaylist: string,
		videosToMove: "all" | number
	) {
		console.log("Moving from", currentPlaylist, "to", targetPlaylist);
		if (currentPlaylist == "") {
			console.error("Current playlist name is empty");
			return;
		}
		if (targetPlaylist == "") {
			console.error("Target playlist name is empty");
			return;
		}

		let currVideoIdx = 0;
		let videosMoved = 0;
		for (const video of document.getElementsByTagName(
			"ytd-playlist-video-renderer"
		) as HTMLCollectionOf<HTMLElement>) {
			if (!this.running) {
				console.log("Moving videos disabled");
				return;
			}

			if (videosToMove !== "all" && videosMoved >= videosToMove) {
				alert(`Done moving ${videosMoved} videos`);
				this.running = false;
				return;
			}

			if (currVideoIdx < this.current_video_idx) {
				console.log("Skipping already moved video #", currVideoIdx);
				currVideoIdx += 1;
				continue;
			}

			console.log("Processing video #" + this.current_video_idx);
			video.getElementsByTagName("button")[0].click(); // only one button should exist
			console.log("Pressed the menu button");
			await sleep(0.2);

			for (const saveToPlaylistButton of document.getElementsByTagName(
				"tp-yt-paper-item"
			) as HTMLCollectionOf<HTMLElement>) {
				if (
					saveToPlaylistButton.textContent?.indexOf("Save to playlist") == -1
				) {
					continue;
				}

				saveToPlaylistButton.click();
				console.log("Pressed save to playlist button");
				await sleep(2.5);

				const playlists =
					(document
						.getElementById("playlists")
						?.getElementsByTagName(
							"tp-yt-paper-checkbox"
						) as HTMLCollectionOf<HTMLInputElement>) ??
					throwExpr("Playlists not found");

				let targetPlaylistElem: HTMLInputElement | null = null;
				let currentPlaylistElem: HTMLInputElement | null = null;

				for (const playlist of playlists) {
					if (targetPlaylistElem != null && currentPlaylistElem != null) {
						break;
					}

					if (playlist.textContent?.trim() === targetPlaylist) {
						targetPlaylistElem = playlist;
					} else if (playlist.textContent?.trim() === currentPlaylist) {
						currentPlaylistElem = playlist;
					}
				}

				// both playlists found
				if (targetPlaylistElem != null && currentPlaylistElem != null) {
					// add to target playlist if not already there
					if (targetPlaylistElem.ariaChecked === "false") {
						targetPlaylistElem.click();
						await sleep(0.2);
					}

					if (currentPlaylistElem.ariaChecked === "true") {
						currentPlaylistElem.click();
						await sleep(0.2);
					}
				} else if (targetPlaylistElem == null) {
					alert("Target playlist not found");
					return;
				} else if (currentPlaylistElem == null) {
					alert("Current playlist not found");
					return;
				} else {
					console.error("Unreachable");
					return;
				}
			}

			const closeButton =
				document.getElementById("close-button") ??
				throwExpr("Close button not found");
			closeButton.click();
			console.log("Clicked the close save to playlist button");
			await sleep(0.2);

			this.current_video_idx += 1;
			currVideoIdx += 1;
			videosMoved += 1;
		}

		this.running = false;
		alert(`Done moving ${MoveVideos} videos`);
	}

	static getCurrentPlaylist(): string {
		const playlistMetadata =
			document.getElementsByClassName("metadata-wrapper")[0]; // only one
		const playlistName = playlistMetadata.getElementsByClassName(
			"yt-dynamic-sizing-formatted-string"
		)[0].textContent; // dunno what [1] is

		return playlistName?.trim() ?? throwExpr("Current playlist name is null");
	}
}
