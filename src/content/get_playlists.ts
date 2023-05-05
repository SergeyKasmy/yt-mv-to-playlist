import { is_button, sleep, throw_expr } from "../utils";

export default async function get_playlists(): Promise<string[]> {
	const video = document.getElementsByTagName("ytd-playlist-video-renderer")[0];

	video.getElementsByTagName("button")[0].click(); // only one button should exist
	console.log("Pressed the menu button");
	await sleep(0.2);

	let playlists: string[] = [];

	for (const save_to_playlist_button of document.getElementsByTagName(
		"tp-yt-paper-item"
	)) {
		const save_to_playlist_button_text = save_to_playlist_button.textContent;
		if (
			save_to_playlist_button_text == null ||
			save_to_playlist_button_text.indexOf("Save to playlist") == -1
		) {
			console.log("Skipping");
			continue;
		}

		console.log("FOUND:", save_to_playlist_button);

		is_button(save_to_playlist_button);
		save_to_playlist_button.click();
		console.log("Pressed save to playlist button");
		await sleep(2.5);

		const playlists_html_collection =
			document
				.getElementById("playlists")
				?.getElementsByTagName("yt-formatted-string") ??
			throw_expr("Playlists not found");

		playlists = Array.from(playlists_html_collection)
			.map((playlist_elem) => {
				return playlist_elem.textContent;
			})
			.filter((playlist_name) => {
				return playlist_name != null && playlist_name != "";
			}) as string[];

		console.log("Playlists:", playlists);
		break;
	}

	const close_button =
		document.getElementById("close-button") ??
		throw_expr("Close button not found");

	is_button(close_button);
	close_button.click();
	console.log("Clicked the close save to playlist button");

	return playlists;
}
