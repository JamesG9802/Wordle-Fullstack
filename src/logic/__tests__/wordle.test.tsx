import { describe, expect, it } from 'vitest'
import { GenerateOutcomeString, Outcome } from '../wordle';

describe("wordle: outcome string", () => {
    it("should handle all common letters.", () => {
        let guess: string = "abcde";
        let actual: string = "abcde";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        let exepected_outcome: Outcome[] = [Outcome.CORRECT, Outcome.CORRECT, Outcome.CORRECT, Outcome.CORRECT, Outcome.CORRECT,];
        expect(outcome).toEqual(exepected_outcome);
    })
    it("should handle no common letters", () => {
        let guess: string = "guest";
        let actual: string = "chink";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        let exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("should handle a letter in the wrong spot.", () => {
        let guess: string = "guest";
        let actual: string = "think";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        let exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.IN_WORD,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("should handle a correct letter.", () => {
        let guess: string = "guest";
        let actual: string = "goopy";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        let exepected_outcome: Outcome[] = [Outcome.CORRECT, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("should handle two letters in the correct and wrong spots.", () => {
        let guess: string = "ggabc";
        let actual: string = "gdgef";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        let exepected_outcome: Outcome[] = [Outcome.CORRECT, Outcome.IN_WORD, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);
    });
    it("shouldn't handle strings of the wrong size.", () => {
        let guess: string = "abcd";
        let actual: string = "abcde";
        let outcome: Outcome[] = GenerateOutcomeString(guess, actual);
        let exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);

        outcome = GenerateOutcomeString(actual, guess);
        expect(outcome).toEqual(exepected_outcome);
    });
    it("shouldn't handle undefined strings", () => {
        let guess: string = undefined as unknown as string;
        let actual: string = "abcde";
        let outcome: Outcome[] = GenerateOutcomeString(undefined as unknown as string, actual);
        let exepected_outcome: Outcome[] = [Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED, Outcome.UNUSED,];
        expect(outcome).toEqual(exepected_outcome);

        outcome = GenerateOutcomeString(actual, guess);
        expect(outcome).toEqual(exepected_outcome);
    });
});