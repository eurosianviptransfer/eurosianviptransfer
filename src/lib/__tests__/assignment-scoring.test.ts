import { describe, expect, it } from "vitest";
import { rankAssignmentCandidates, scoreAssignmentCandidate } from "@/lib/assignment/scoring";

describe("assignment scoring", () => {
  it("rating and low workload improve the score", () => {
    expect(scoreAssignmentCandidate({ averageRating: 5, ratingCount: 10, activeJobs: 0 })).toBeGreaterThan(scoreAssignmentCandidate({ averageRating: 3, ratingCount: 1, activeJobs: 2 }));
  });
  it("ranks candidates deterministically", () => {
    const ranked = rankAssignmentCandidates([{ id: "a", name: "A", averageRating: 4.8, ratingCount: 8, activeJobs: 0 }, { id: "b", name: "B", averageRating: 4, ratingCount: 8, activeJobs: 0 }]);
    expect(ranked[0]?.id).toBe("a");
  });
});
