import browser from "webextension-polyfill";
import { Action, Response } from "../action.ts";
import MoveVideos from "./move_videos.ts";
import ScrollToEnd from "./scroll_to_end.ts";
import get_playlists from "./get_playlists.ts";

let move_videos: MoveVideos | null = null;
let scroll_to_end: ScrollToEnd | null = null;

browser.runtime.onMessage.addListener(async (action: Action | null) => {
	console.log("Received action", action);
	if (action != null) {
		switch (action.action) {
			case "move_videos": {
				console.log("Received message move_videos");

				// create new and start if called for the first time,
				// toggle otherwise
				if (move_videos == null) move_videos = new MoveVideos();
				else move_videos.enabled = !move_videos.enabled;

				const current_playlist = MoveVideos.get_current_playlist();
				console.log("current_playlist is", current_playlist);
				console.log(
					"Calling move_videos" +
						"(" +
						current_playlist +
						", " +
						action.target_playlist +
						")"
				);
				move_videos.move_videos(current_playlist, action.target_playlist);

				break;
			}
			case "scroll_to_end": {
				// create new and start if called for the first time,
				// toggle otherwise
				if (scroll_to_end == null) scroll_to_end = new ScrollToEnd();
				else scroll_to_end.enabled = !scroll_to_end.enabled;

				scroll_to_end.scroll_to_end();
				break;
			}
			case "get_playlists": {
				const playlists = await get_playlists();

				const response: Response = {
					type: "playlists",
					playlists: playlists,
				};

				console.log("Responding with:", response);
				// sendResponse(response);
				return Promise.resolve(response);
			}
		}
	}

	const response: Response = {
		type: "running_status",
		move_videos_running: move_videos?.enabled ?? false,
		scroll_to_end_running: scroll_to_end?.enabled ?? false,
	};

	console.log("Responding with:", response);
	// sendResponse(response);

	return Promise.resolve(response);
});
