import browser from "webextension-polyfill";
import {
	Action,
	Response as Response,
	RunningStatus,
	isResponse,
} from "../communication.ts";
import { throwExpr } from "../utils.ts";

// Send null if just to request running status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage(action: Action | null): Promise<Response> {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	const selectedTabId = tabs[0]?.id ?? throwExpr("Active tab has no ID");
	const response: unknown = await browser.tabs.sendMessage(
		selectedTabId,
		action
	);

	if (!isResponse(response)) {
		let responseStr = "";
		if (
			typeof response === "object" &&
			response != null &&
			typeof response.toString === "function"
		) {
			responseStr = ": " + response.toString();
		} else if (response == null) {
			responseStr = ": null";
		}

		throw new Error(
			"sendMessage response isn't of type Response" + responseStr
		);
	}

	console.log("Received response:", response);

	return response;
}

async function sendAction(action: Action | null): Promise<RunningStatus> {
	const response = await sendMessage(action);
	if (response.responseType != "running_status")
		throw new Error(
			"For some reason content script hasn't returned RunningStatus for a status request??"
		);
	return response;
}

async function moveVideos(): Promise<RunningStatus | null> {
	const targetPlaylistSelect = document.getElementById(
		"target_playlist_select"
	) as HTMLSelectElement | null;

	if (targetPlaylistSelect == null)
		throw new Error("Target playlist select not found");

	const targetPlaylist =
		targetPlaylistSelect.options[targetPlaylistSelect.selectedIndex]
			.textContent;

	if (targetPlaylist == null || targetPlaylist == "") {
		console.log("Ignoring empty target playlist name");
		return null;
	}

	return sendAction({
		action: "move_videos",
		targetPlaylist: targetPlaylist,
	});
}

async function scrollToEnd(): Promise<RunningStatus> {
	return sendAction({
		action: "scroll_to_end",
	});
}

async function getAllPlaylists(): Promise<string[]> {
	const response = await sendMessage({ action: "get_playlists" });
	if (response.responseType != "playlists")
		throwExpr(
			"For some reason content script hasn't returned playlists for a playlists request??"
		);
	return response.playlists;
}

function updateButtonRunningCaption(status: RunningStatus) {
	const moveVideosButton =
		document.getElementById("move_videos_button") ??
		throwExpr("move_videos_button not found");
	moveVideosButton.textContent = status.moveVideosRunning
		? "Stop moving videos"
		: "Move videos";

	const scrollToEndButton =
		document.getElementById("scroll_to_end_button") ??
		throwExpr("scroll_to_end_button not found");
	scrollToEndButton.textContent = status.scrollToEndRunning
		? "Stop scrolling to end"
		: "Scroll to end";
}

// check running status and update button captions
sendAction(null).then((status) => updateButtonRunningCaption(status));

// handle button clicks
document.addEventListener("click", async (event) => {
	console.log("Handling a click");

	if (event.target == null || !(event.target instanceof HTMLElement)) return;

	if (event.target.id === "move_videos_button") {
		console.log("Clicked move_videos_button");

		const status = await moveVideos();
		if (status == null) return;
		updateButtonRunningCaption(status);
	} else if (event.target.id === "get_playlists_button") {
		// TODO: disable this button if RunningStatus == enabled
		const playlists = await getAllPlaylists();

		const targetPlaylistSelect = (document.getElementById(
			"target_playlist_select"
		) ?? throwExpr("target_playlist_select not found")) as HTMLSelectElement;

		console.log("Received a list of playlists:", playlists.length);

		for (const playlist of playlists) {
			const option = document.createElement("option");
			console.log("Setting value to", playlist);
			option.textContent = playlist;
			targetPlaylistSelect.appendChild(option);
		}
	} else if (event.target.id === "scroll_to_end_button") {
		console.log("Clicked scroll_to_end_button");

		const status = await scrollToEnd();
		updateButtonRunningCaption(status);
	} else {
		console.log("Clicked something but not a button");
	}
});
