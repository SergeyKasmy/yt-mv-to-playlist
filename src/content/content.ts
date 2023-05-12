import browser from "webextension-polyfill";
import { Action, Response } from "../communication.ts";
import MoveVideos from "./move_videos.ts";
import ScrollToEnd from "./scroll_to_end.ts";
import getPlaylists from "./get_playlists.ts";

let moveVideos: MoveVideos | null = null;
let scrollToEnd: ScrollToEnd | null = null;

browser.runtime.onMessage.addListener(
	// SAFETY: action is always either Action or null
	async (action: Action | null): Promise<Response> => {
		console.log("Received action", action);
		if (action == null) {
			const response: Response = {
				responseType: "is_running",
				isMoveRunning: moveVideos?.enabled ?? false,
				isScrollRunning: scrollToEnd?.enabled ?? false,
			};

			console.log("Responding with:", response);

			return Promise.resolve(response);
		}

		switch (action.action) {
			case "move_videos": {
				console.log("Received message move_videos");

				// create new and start if called for the first time,
				// toggle otherwise
				if (moveVideos == null) moveVideos = new MoveVideos();

				if (action.run == "start") {
					moveVideos.enabled = true;
					const current_playlist = MoveVideos.getCurrentPlaylist();

					console.log("current_playlist is", current_playlist);
					console.log(
						`Calling move_videos(${current_playlist}, ${action.targetPlaylist})`
					);

					moveVideos.moveVideos(current_playlist, action.targetPlaylist);
				} else {
					moveVideos.enabled = false;
				}

				const response: Response = {
					responseType: "is_move_running",
					isMoveRunning: moveVideos?.enabled ?? false,
				};

				console.log("Responding with:", response);

				return Promise.resolve(response);
			}
			case "scroll_to_end": {
				// create new and start if called for the first time,
				// toggle otherwise
				if (scrollToEnd == null) scrollToEnd = new ScrollToEnd();

				if (action.run == "start") {
					scrollToEnd.enabled = true;
					scrollToEnd.scrollToEnd();
				} else {
					scrollToEnd.enabled = false;
				}

				const response: Response = {
					responseType: "is_scroll_running",
					isScrollRunning: scrollToEnd?.enabled ?? false,
				};

				console.log("Responding with:", response);

				return Promise.resolve(response);
			}
			case "get_playlists": {
				const playlists = await getPlaylists();

				const response: Response = {
					responseType: "playlists",
					playlists,
				};

				console.log("Responding with:", response);
				return Promise.resolve(response);
			}
		}

	}
);
