import { sleep, throwExpr } from "../utils";

export default async function getPlaylists(): Promise<string[]> {
	const video = document.getElementsByTagName("ytd-playlist-video-renderer")[0];

	video.getElementsByTagName("button")[0].click(); // only one button should exist
	console.log("Pressed the menu button");
	await sleep(0.2);

	let playlists: string[] = [];

	for (const saveToPlaylistButton of document.getElementsByTagName(
		"tp-yt-paper-item"
	) as HTMLCollectionOf<HTMLElement>) {
		const saveToPlaylistButtonText = saveToPlaylistButton.textContent;
		if (
			saveToPlaylistButtonText == null ||
			saveToPlaylistButtonText.indexOf("Save to playlist") == -1
		) {
			console.log("Skipping");
			continue;
		}

		console.log("FOUND:", saveToPlaylistButton);

		saveToPlaylistButton.click();
		console.log("Pressed save to playlist button");
		await sleep(2.5);

		const playlists_html_collection =
			document
				.getElementById("playlists")
				?.getElementsByTagName("yt-formatted-string") ??
			throwExpr("Playlists not found");

		playlists = Array.from(playlists_html_collection)
			.map((playlist_elem) => {
				return playlist_elem.textContent;
			})
			.filter((playlist_name) => {
				return playlist_name != null && playlist_name != "";
			}) as string[];	// just filtered out null, should never be null

		console.log("Playlists:", playlists);
		break;
	}

	const closeButton =
		document.getElementById("close-button") ??
		throwExpr("Close button not found");

	closeButton.click();
	console.log("Clicked the close save to playlist button");

	return playlists;
}
