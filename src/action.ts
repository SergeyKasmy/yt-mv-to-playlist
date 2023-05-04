export type Action = ActionMoveVideos | ActionScrollToEnd;
export type RunningStatus = {
	move_videos_running: boolean;
	scroll_to_end_running: boolean;
};

type ActionMoveVideos = {
	action: "move_videos";
	target_playlist: string;
};

type ActionScrollToEnd = {
	action: "scroll_to_end";
};
