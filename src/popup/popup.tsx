import browser from "webextension-polyfill";
import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";

import { Action, Response, isResponse } from "../communication.ts";
import { throwExpr, throwWrongTypeError } from "../utils.ts";

// Send null if just to request running status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendMessage(action: Action): Promise<Response> {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	const selectedTabId = tabs.at(0)?.id ?? throwExpr("Active tab has no ID");
	// FIXME: throws "could not establish connection receiving end doesn't exist" if the content script isn't loaded
	const response: unknown = await browser.tabs.sendMessage(
		selectedTabId,
		action
	);

	if (!isResponse(response)) {
		throwWrongTypeError("response", response, "Response");
	}

	console.log("Received response:", response);

	return response;
}

export default function Popup() {
	const [targetPlaylists, setTargetPlaylists] = useState<string[]>([]);
	const [targetPlaylist, setTargetPlaylist] = useState<string | null>(null);
	const [isMoveRunning, setIsMoveRunning] = useState(false);
	const [isScrollRunning, setIsScrollRunning] = useState(false);

	useEffect(() => {
		(async () => {
			console.log("Getting status");

			const status = await sendMessage({ action: "get_status" });
			console.log("status:", status);

			if (
				"isMoveRunning" in status &&
				"isScrollRunning" in status &&
				"playlists" in status
			) {
				console.log("Setting isMoveRunning to", status.isMoveRunning);
				console.log("Setting isScrollRunning to", status.isScrollRunning);
				console.log("Setting targetPlaylists to", status.playlists);

				setIsMoveRunning(status.isMoveRunning);
				setIsScrollRunning(status.isScrollRunning);
				if (status.playlists != null) {
					setTargetPlaylists(status.playlists);
				}
			} else {
				throwWrongTypeError("status", status, "IsRunning");
			}
		})();
	}, []);

	// set target playlist to the first out of the target platlist list if it's null
	useEffect(() => {
		if (targetPlaylist == null) {
			const first = targetPlaylists.at(0);
			if (first != null) {
				console.log("Automatically setting target playlist to", first);
				setTargetPlaylist(first);
			}
		}
	}, [targetPlaylists]);

	return (
		<>
			<TargetPlaylistSelect
				playlists={targetPlaylists}
				setTargetPlaylist={setTargetPlaylist}
			/>
			<MoveVideosButton
				isRunning={isMoveRunning}
				setIsRunning={setIsMoveRunning}
				targetPlaylist={targetPlaylist}
			/>
			<GetPlaylistsButton setTargetPlaylists={setTargetPlaylists} />
			<ScrollToEndButton
				isRunning={isScrollRunning}
				setIsRunning={setIsScrollRunning}
			/>
		</>
	);
}

type TargetPlaylistSelectProps = {
	playlists: string[];
	setTargetPlaylist: (playlist: string) => void;
};

function TargetPlaylistSelect({
	playlists,
	setTargetPlaylist,
}: TargetPlaylistSelectProps) {
	console.log("Rerendering TargetPlaylistSelect");

	function handleChange(event: JSX.TargetedEvent<HTMLSelectElement>) {
		const targetPlaylist =
			event.currentTarget.options[event.currentTarget.selectedIndex]
				.textContent;
		console.log("Target playlist:", targetPlaylist);

		if (targetPlaylist != null) {
			setTargetPlaylist(targetPlaylist);
		}
	}

	return (
		<select className="input" onInput={handleChange}>
			{playlists.map((playlist) => (
				<option key={playlist}>{playlist}</option>
			))}
		</select>
	);
}

type MoveVideosButtonProps = {
	targetPlaylist: string | null;
	isRunning: boolean;
	setIsRunning: (isRunning: boolean) => void;
};

function MoveVideosButton({
	targetPlaylist,
	isRunning,
	setIsRunning,
}: MoveVideosButtonProps) {
	console.log("Rerendering MoveVideosButton");

	async function handleClick() {
		let status;
		if (isRunning) {
			status = await sendMessage({
				action: "move_videos",
				run: "stop",
			});
		} else if (targetPlaylist != null && targetPlaylist !== "") {
			status = await sendMessage({
				action: "move_videos",
				run: "start",
				targetPlaylist,
			});
		} else {
			console.log("Ignoring empty target playlist name"); // but only if we ~want~ to start
			return null;
		}

		if (!("isMoveRunning" in status)) {
			throwWrongTypeError("status", status, "isMoveRunning");
		}

		setIsRunning(status.isMoveRunning);
	}

	const caption = isRunning ? "Stop moving videos" : "Move videos";

	return (
		<button className="input" onClick={handleClick}>
			{caption}
		</button>
	);
}

function GetPlaylistsButton({
	setTargetPlaylists,
}: {
	setTargetPlaylists: (targetPlaylists: string[]) => void;
}) {
	console.log("Rerendering GetPlaylistsButton");

	async function handleClick() {
		const response = await sendMessage({
			action: "get_playlists",
		});

		if (response.responseType != "playlists")
			throwExpr(
				"For some reason content script hasn't returned playlists for a playlists request??"
			);

		setTargetPlaylists(
			response?.playlists ??
				throwWrongTypeError("playlists", response?.playlists, "string[]")
		);
	}

	return (
		<button className="input" onClick={handleClick}>
			Get playlists
		</button>
	);
}

type ScrollToEndButtonProps = {
	isRunning: boolean;
	setIsRunning: (isRunning: boolean) => void;
};

function ScrollToEndButton({
	isRunning,
	setIsRunning,
}: ScrollToEndButtonProps) {
	console.log("Rerendering ScrollToEndButton");

	async function handleClick() {
		const status = await sendMessage({
			action: "scroll_to_end",
			run: isRunning ? "stop" : "start",
		});

		if (!("isScrollRunning" in status)) {
			throwWrongTypeError("status", status, "IsScrollRunning");
		}

		setIsRunning(status.isScrollRunning);
	}

	const caption = isRunning ? "Stop scrolling" : "Scroll to end";

	return (
		<button className="input" onClick={handleClick}>
			{caption}
		</button>
	);
}
