import { GetCurrentWordOfDay, GetValidWords } from "services/wordle_api";
import { describe, expect, it } from "vitest";

describe("Wordle API", () => {
  it("should fetch dictionary", async () => {
    const words = await GetValidWords();
    
    expect((words as string[]).length).toBeGreaterThan(10000);
  });
  it("should fetch word of the day", async () => {
    const word = await GetCurrentWordOfDay(0);
    
    expect(word).toBeDefined();
  });
});
