export type Action = ActionMoveVideos | ActionScrollToEnd | ActionGetPlaylists;

export type ActionMoveVideos = ActionMoveVideosStart | ActionMoveVideosEnd;

export type ActionMoveVideosStart = {
	action: "move_videos";
	run: "start"
	targetPlaylist: string;
};

export type ActionMoveVideosEnd = {
	action: "move_videos";
	run: "stop"
};

export type ActionScrollToEnd = {
	action: "scroll_to_end";
	run: "start" | "stop",
};

export type ActionGetPlaylists = {
	action: "get_playlists";
};

// ------------------------------------

export type Response = IsRunning | IsMoveRunning | IsScrollRunning | Playlists;

export type IsRunning = {
	responseType: "is_running"
} & Omit<IsMoveRunning, "responseType"> & Omit<IsScrollRunning, "responseType">;

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
