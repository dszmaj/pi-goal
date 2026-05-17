export const SISYPHUS_STEP_TOOL_NAME = "step_complete";
export const TWEAK_APPLY_TOOL_NAME = "apply_goal_tweak";
export const PROPOSE_DRAFT_TOOL_NAME = "propose_goal_draft";
export const CREATE_GOAL_TOOL_NAME = "create_goal";
export const QUESTION_TOOL_NAME = "goal_question";
export const QUESTIONNAIRE_TOOL_NAME = "goal_questionnaire";
export const ABORT_GOAL_TOOL_NAME = "abort_goal";

export const ACTIVE_GOAL_TOOL_NAMES = ["get_goal", "update_goal", "pause_goal", ABORT_GOAL_TOOL_NAME] as const;
export const PAUSED_GOAL_TOOL_NAMES = ["get_goal", "update_goal", ABORT_GOAL_TOOL_NAME] as const;
export const NO_FOCUSED_GOAL_TOOL_NAMES = ["get_goal"] as const;

export const GOAL_WORK_TOOL_NAMES = [
	"update_goal",
	"pause_goal",
	ABORT_GOAL_TOOL_NAME,
	TWEAK_APPLY_TOOL_NAME,
	CREATE_GOAL_TOOL_NAME,
	PROPOSE_DRAFT_TOOL_NAME,
	QUESTION_TOOL_NAME,
	QUESTIONNAIRE_TOOL_NAME,
	"get_goal",
	"write",
	"edit",
	"bash",
	"read",
	"grep",
	"find",
	"ls",
] as const;

export const GOAL_PROGRESS_TOOL_NAMES = [
	"update_goal",
	"pause_goal",
	ABORT_GOAL_TOOL_NAME,
	TWEAK_APPLY_TOOL_NAME,
	"write",
	"edit",
	"bash",
	"read",
	"grep",
	"find",
	"ls",
] as const;

export const POST_STOP_ALLOWED_TOOLS = ["get_goal"] as const;

const STATIC_GOAL_PROGRESS_TOOL_NAME_SET = new Set<string>(GOAL_PROGRESS_TOOL_NAMES);
const KNOWN_NON_PROGRESS_TOOL_NAME_SET = new Set<string>([
	"get_goal",
	CREATE_GOAL_TOOL_NAME,
	PROPOSE_DRAFT_TOOL_NAME,
	QUESTION_TOOL_NAME,
	QUESTIONNAIRE_TOOL_NAME,
	SISYPHUS_STEP_TOOL_NAME,
]);

export type GoalToolStatus = "active" | "paused" | "complete" | null | undefined;


export type GoalToolPhase = "normal" | "drafting" | "tweakDrafting";

export function lifecycleToolNamesForGoalStatus(status: GoalToolStatus, phase: GoalToolPhase = "normal"): readonly string[] {
	if (phase === "drafting" || phase === "tweakDrafting") return NO_FOCUSED_GOAL_TOOL_NAMES;
	if (status === "active") return ACTIVE_GOAL_TOOL_NAMES;
	if (status === "paused") return PAUSED_GOAL_TOOL_NAMES;
	return NO_FOCUSED_GOAL_TOOL_NAMES;
}

export function isQuestionLikeToolName(toolName: string): boolean {
	const lower = toolName.toLowerCase();
	return lower === QUESTION_TOOL_NAME
		|| lower === QUESTIONNAIRE_TOOL_NAME
		|| lower.includes("question")
		|| lower.includes("questionnaire")
		|| lower.includes("ask")
		|| lower.includes("clarify")
		|| lower.includes("confirm");
}

function isDialogueProgressExclusion(toolName: string): boolean {
	const lower = toolName.toLowerCase();
	return lower === "question"
		|| lower === "questionnaire"
		|| lower === "ask"
		|| lower.startsWith("ask_")
		|| lower.endsWith("_ask")
		|| lower === "clarify"
		|| lower.startsWith("clarify_")
		|| lower.endsWith("_clarify")
		|| lower === "confirm"
		|| lower.startsWith("confirm_")
		|| lower.endsWith("_confirm");
}

export function isGoalProgressToolName(toolName: string): boolean {
	if (STATIC_GOAL_PROGRESS_TOOL_NAME_SET.has(toolName)) return true;
	if (KNOWN_NON_PROGRESS_TOOL_NAME_SET.has(toolName)) return false;
	if (isDialogueProgressExclusion(toolName)) return false;
	// Unknown extension/custom tools are presumed to be goal work. Users and packages
	// can register arbitrary research, data, browser, or project-specific tools, and
	// the runtime should not need a hard-coded global list before those calls can
	// keep an active goal moving.
	return true;
}
