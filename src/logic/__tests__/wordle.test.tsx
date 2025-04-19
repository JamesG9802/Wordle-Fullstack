import { describe, expect, it } from 'vitest'
import { GenerateOutcomeString, Outcome } from '../wordle';

describe("wordle: outcome string", () => {
    it("should handle all common letters.", () => {
        const guess: string = "abcde";
        const actual: string = "abcde";
        const outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        const exepected_outcome: Outcome[] = [Outcome.CORRECT, Outcome.CORRECT, Outcome.CORRECT, Outcome.CORRECT, Outcome.CORRECT,];
        expect(outcome).toEqual(exepected_outcome);
    })
    it("should handle no common letters", () => {
        const guess: string = "guest";
        const actual: string = "chink";
        const outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        const exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("should handle a letter in the wrong spot.", () => {
        const guess: string = "guest";
        const actual: string = "think";
        const outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        const exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.IN_WORD,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("should handle a correct letter.", () => {
        const guess: string = "guest";
        const actual: string = "goopy";
        const outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        const exepected_outcome: Outcome[] = [Outcome.CORRECT, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("should handle two letters in the correct and wrong spots.", () => {
        const guess: string = "ggabc";
        const actual: string = "gdgef";
        const outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        const exepected_outcome: Outcome[] = [Outcome.CORRECT, Outcome.IN_WORD, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("shouldn't handle strings of the wrong size.", () => {
        const guess: string = "abcd";
        const actual: string = "abcde";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        const exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);

        outcome = GenerateOutcomeString(actual, guess);
        expect(outcome).toEqual(exepected_outcome);
    });
    it("shouldn't handle undefined strings", () => {
        const guess: string = undefined as unknown as string;
        const actual: string = "abcde";
        let outcome: Outcome[] = GenerateOutcomeString(undefined as unknown as string, actual);
        const exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);

        outcome = GenerateOutcomeString(actual, guess);
        expect(outcome).toEqual(exepected_outcome);
    });
});