import browser from "webextension-polyfill";
import { Action, Response, RunningStatus } from "../action.ts";
import { throw_expr } from "../utils.ts";

// Send null if just to request running status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function send_message(action: Action | null): Promise<Response> {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	const selected_tab_id = tabs[0]?.id ?? throw_expr("Active tab has no ID");
	const response: Response | null = await browser.tabs.sendMessage(
		selected_tab_id,
		action
	);

	if (response == null) {
		console.error("sendMessage response is null??");
		throw new Error("sendMessage response is null??");
	}

	console.log("Received response:", response);

	return response;
}

async function send_action(action: Action | null): Promise<RunningStatus> {
	const response = await send_message(action);
	if (response.type != "running_status")
		throw_expr(
			"For some reason content script hasn't returned RunningStatus for a status request??"
		);
	return response;
}

async function move_videos(): Promise<RunningStatus | null> {
	const target_playlist_select = document.getElementById(
		"target_playlist_select"
	) as HTMLSelectElement | null;

	if (target_playlist_select == null)
		throw new Error("Target playlist select not found");

	const target_playlist =
		target_playlist_select.options[target_playlist_select.selectedIndex]
			.textContent;

	if (target_playlist == null || target_playlist == "") {
		console.log("Ignoring empty target playlist name");
		return null;
	}

	return send_action({
		action: "move_videos",
		target_playlist: target_playlist,
	});
}

async function scroll_to_end(): Promise<RunningStatus> {
	return send_action({
		action: "scroll_to_end",
	});
}

async function get_all_playlists(): Promise<string[]> {
	const response = await send_message({ action: "get_playlists" });
	if (response.type != "playlists")
		throw_expr(
			"For some reason content script hasn't returned playlists for a playlists request??"
		);
	return response.playlists;
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

send_action(null).then((status) => update_button_running_caption(status));
document.addEventListener("click", async (event) => {
	console.log("Handling a click");

	if (event.target == null || !(event.target instanceof HTMLElement)) return;

	if (event.target.id === "move_videos_button") {
		console.log("Clicked move_videos_button");

		const status = await move_videos();
		if (status == null) return;
		update_button_running_caption(status);
	} else if (event.target.id === "get_playlists_button") {
		// TODO: disable this button if RunningStatus == enabled
		const playlists = await get_all_playlists();

		const target_playlist_select = (document.getElementById(
			"target_playlist_select"
		) ?? throw_expr("target_playlist_select not found")) as HTMLSelectElement;

		console.log("Received a list of playlists:", playlists.length);

		for (const playlist of playlists) {
			const option = document.createElement("option");
			console.log("Setting value to", playlist);
			option.textContent = playlist;
			target_playlist_select.appendChild(option);
		}
	} else if (event.target.id === "scroll_to_end_button") {
		console.log("Clicked scroll_to_end_button");

		const status = await scroll_to_end();
		update_button_running_caption(status);
	} else {
		console.log("Clicked something but not a button");
	}
});
