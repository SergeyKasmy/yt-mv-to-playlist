import browser from "webextension-polyfill";
import {
	Action,
	IsMoveRunning,
	IsScrollRunning,
	Playlists,
	Response,
	Status,
} from "../communication.ts";
import MoveVideos from "./move_videos.ts";
import ScrollToEnd from "./scroll_to_end.ts";
import getPlaylists from "./get_playlists.ts";

let moveVideos: MoveVideos | null = null;
let scrollToEnd: ScrollToEnd | null = null;
let playlists: string[] | null = null;

browser.runtime.onMessage.addListener(
	async (action: Action): Promise<Response> => {
		console.log("Received action", action);

		switch (action.action) {
			case "get_status": {
				const response: Status = {
					responseType: "status",
					isMoveRunning: moveVideos?.running ?? false,
					isScrollRunning: scrollToEnd?.running ?? false,
					playlists,
				};

				console.log("Responding with:", response);

				return Promise.resolve(response);
			}
			case "move_videos": {
				console.log("Received message move_videos");

				// create new and start if called for the first time,
				// toggle otherwise
				if (moveVideos == null) moveVideos = new MoveVideos();

				if (action.run == "start") {
					moveVideos.running = true;
					const current_playlist = MoveVideos.getCurrentPlaylist();

					console.log("current_playlist is", current_playlist);
					console.log(
						`Calling move_videos(${current_playlist}, ${action.targetPlaylist}, ${action.videosToMove})`
					);

					moveVideos.moveVideos(
						current_playlist,
						action.targetPlaylist,
						action.videosToMove
					);
				} else {
					moveVideos.running = false;
				}

				const response: IsMoveRunning = {
					responseType: "is_move_running",
					isMoveRunning: moveVideos?.running ?? false,
				};

				console.log("Responding with:", response);

				return Promise.resolve(response);
			}
			case "scroll_to_end": {
				// create new and start if called for the first time,
				// toggle otherwise
				if (scrollToEnd == null) scrollToEnd = new ScrollToEnd();

				if (action.run == "start") {
					scrollToEnd.running = true;
					scrollToEnd.scrollToEnd();
				} else {
					scrollToEnd.running = false;
				}

				const response: IsScrollRunning = {
					responseType: "is_scroll_running",
					isScrollRunning: scrollToEnd?.running ?? false,
				};

				console.log("Responding with:", response);

				return Promise.resolve(response);
			}
			case "get_playlists": {
				playlists = await getPlaylists();

				const response: Playlists = {
					responseType: "playlists",
					playlists,
				};

				console.log("Responding with:", response);
				return Promise.resolve(response);
			}
		}
	}
);
