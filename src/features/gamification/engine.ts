export type GamificationState = {
  streakDays: number;
  xp: number;
};

export function calculateXp(state: GamificationState): number {
  return state.xp + state.streakDays * 5;
}
