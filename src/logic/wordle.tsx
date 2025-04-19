import log from "loglevel"

/**
 * The length of a wordle word.
 */
export const WORDLE_LENGTH: number = 5;

/**
 * The number of guesses for a wordle game.
 */
export const WORDLE_GUESSES: number = 6;

/**
 * The outcome of a letter of a wordle guess.
 */
export enum Outcome {
    /**
     * The letter is not used in the word at all.
     */
    UNUSED = 0,

    /**
     * The letter is used in the word, but is in a different place.
     */
    IN_WORD = 1,

    /**
     * The letter is used in the word and is in the correct place.
     */
    CORRECT = 2
} 

/**
 * Generates the outcome string of a word
 * @param guessed_word the guess
 * @param actual_word the actual word
 * @returns the outcome array for each character
 */
export function GenerateOutcomeString(guessed_word: string, actual_word: string): Outcome[] {
    //  Based on https://github.com/JamesG9802/Wordle-Information-Gain/blob/main/script.js#L409
    let outcome: Outcome[] = new Array(WORDLE_LENGTH).fill(Outcome.UNUSED);
    if(!guessed_word || guessed_word.length != WORDLE_LENGTH) {
        log.error(`Guess '${guessed_word}' is not a valid guess.`);
        return outcome;
    }
    if(!actual_word || actual_word.length != WORDLE_LENGTH) {
        log.error(`Actual word '${actual_word}' is not a valid word.`);
        return outcome;
    }

    guessed_word = guessed_word.toLowerCase();
    actual_word = actual_word.toLowerCase();

    let letter_count: Record<string, number> = {};

    //  Green pass - if the letter is in the right spot, its COREECT. Then add it to the letter count.
    for(let i = 0; i < WORDLE_LENGTH; i++) {
        let guess_char = guessed_word[i];
        if(guess_char == actual_word[i]) {
            outcome[i] = Outcome.CORRECT;
            letter_count[guess_char] = (letter_count[guess_char] ?? 0) + 1;
        }
    }

    //  Yellow pass
    for(let i = 0; i < WORDLE_LENGTH; i++) {
        if(outcome[i] == Outcome.CORRECT) {
            continue;
        }
        
        let guess_char = guessed_word[i];

        //  Checking if the letter is in the word, but in the wrong spot
        for(let j = 0; j < WORDLE_LENGTH; j++) {
            if(j == i) {
                continue;
            }
            if(guess_char == actual_word[j]) {
                //  Only becomes yellow if the number of times it has appeared is < than # in the actual word
                letter_count[guess_char] = (letter_count[guess_char] ?? 0) + 1;
                let actual_letter_count = 0;
                for(let k = 0; k < WORDLE_LENGTH; k++) {
                    if(actual_word[k] == guess_char) {
                        actual_letter_count += 1;
                    }
                }
                if(letter_count[guess_char] <= actual_letter_count) {
                    outcome[i] = Outcome.IN_WORD;
                }
            }
        }
    }

    return outcome;
}  