import { Action } from "../action.ts";
import move_videos, * as mv from "./move_videos.ts";
import scroll_to_end from "./scroll_to_end.ts";

export function throw_expr(msg: string): never {
	throw new Error(msg);
}

browser.runtime.onMessage.addListener((action: Action) => {
	console.log("Received action", action);
	switch (action.action) {
		case "move_videos":
		{
			console.log("Received message move_videos");
				
			// move_videos.STOPPED = !move_videos.STOPPED;
			mv.set_stopped(!mv.get_stopped());
			const current_playlist = mv.get_current_playlist();
			console.log("current_playlist is", current_playlist);
			console.log("Calling move_videos" + "(" + current_playlist + ", " + action.target_playlist + ")");
			move_videos(current_playlist, action.target_playlist);

			break;
		}
		case "scroll_to_end":
			scroll_to_end();
			break;
	}
});
