export type Action =
	| ActionStatus
	| ActionMoveVideos
	| ActionScrollToEnd
	| ActionGetPlaylists;

export type ActionStatus = {
	action: "get_status";
};

export type ActionMoveVideos = ActionMoveVideosStart | ActionMoveVideosEnd;

export type ActionMoveVideosStart = {
	action: "move_videos";
	run: "start";
	targetPlaylist: string;
};

export type ActionMoveVideosEnd = {
	action: "move_videos";
	run: "stop";
};

export type ActionScrollToEnd = {
	action: "scroll_to_end";
	run: "start" | "stop";
};

export type ActionGetPlaylists = {
	action: "get_playlists";
};

// ------------------------------------

export type Response = Status | IsMoveRunning | IsScrollRunning | Playlists;

export type Status = {
	responseType: "status";
	isMoveRunning: boolean;
	isScrollRunning: boolean;
	playlists: string[] | null;
};

export type IsMoveRunning = {
	responseType: "is_move_running";
	isMoveRunning: boolean;
};

export type IsScrollRunning = {
	responseType: "is_scroll_running";
	isScrollRunning: boolean;
};

export type Playlists = {
	responseType: "playlists";
	playlists: string[];
};

export function isResponse(x: unknown): x is Response {
	return typeof x === "object" && x != null && "responseType" in x;
}
