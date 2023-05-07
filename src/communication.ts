export type Action = ActionMoveVideos | ActionScrollToEnd | ActionGetPlaylists;
export type Response = RunningStatus | Playlists;

export type ActionMoveVideos = {
	action: "move_videos";
	target_playlist: string;
};

export type ActionScrollToEnd = {
	action: "scroll_to_end";
};

export type ActionGetPlaylists = {
	action: "get_playlists";
};

export type RunningStatus = {
	response_type: "running_status";
	move_videos_running: boolean;
	scroll_to_end_running: boolean;
};

export type Playlists = {
	response_type: "playlists";
	playlists: string[];
};

export function isResponse(x: unknown): x is Response {
	return typeof x === "object" && x != null && "response_type" in x;
}
