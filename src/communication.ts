export type Action = ActionMoveVideos | ActionScrollToEnd | ActionGetPlaylists;
export type Response = RunningStatus | Playlists;

export type ActionMoveVideos = {
	action: "move_videos";
	targetPlaylist: string;
};

export type ActionScrollToEnd = {
	action: "scroll_to_end";
};

export type ActionGetPlaylists = {
	action: "get_playlists";
};

export type RunningStatus = {
	responseType: "running_status";
	moveVideosRunning: boolean;
	scrollToEndRunning: boolean;
};

export type Playlists = {
	responseType: "playlists";
	playlists: string[];
};

export function isResponse(x: unknown): x is Response {
	return typeof x === "object" && x != null && "responseType" in x;
}
