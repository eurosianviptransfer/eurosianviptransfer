export type AssignmentCandidate = { id: string; name: string; averageRating: number; ratingCount: number; activeJobs: number; score: number };

export function scoreAssignmentCandidate(input: { averageRating: number; ratingCount: number; activeJobs: number }) {
  const ratingConfidence = Math.min(input.ratingCount, 10) / 10;
  const ratingScore = (input.averageRating / 5) * 70 * (0.6 + ratingConfidence * 0.4);
  const workloadScore = Math.max(0, 30 - input.activeJobs * 10);
  return Number((ratingScore + workloadScore).toFixed(2));
}

export function rankAssignmentCandidates(candidates: Omit<AssignmentCandidate, "score">[]) {
  return candidates.map(candidate => ({ ...candidate, score: scoreAssignmentCandidate(candidate) })).sort((a, b) => b.score - a.score || b.averageRating - a.averageRating || a.activeJobs - b.activeJobs);
}
