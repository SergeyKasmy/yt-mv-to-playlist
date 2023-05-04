export default Action;
type Action = ActionMoveVideos | ActionScrollToEnd;

type ActionMoveVideos = {
	action: "move_videos";
	target_playlist: string;
};

type ActionScrollToEnd = {
	action: "scroll_to_end";
};
