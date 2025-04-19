import { useEffect, useRef, useState } from "react";
import { Text } from "../../components/Text";
import Page from "../../layouts/page";
import { GetCurrentWordOfDay, GetValidWords } from "services/wordle_api";
import { GenerateOutcomeString, Outcome, WORDLE_GUESSES, WORDLE_LENGTH } from "logic/wordle";
import { BeatLoader } from "react-spinners";

import "./index.css";
import log from "loglevel";
import Modal from "components/Modal";
import Keyboard from "./Keyboard";
import { toast, ToastContainer } from "react-toastify";

/**
 * Make an array of a specific size.
 * @param height the number of rows
 * @param width the number of columns
 * @returns the array
 */
function MakeArray(height: number, width: number): any[][] {
  //  https://stackoverflow.com/a/13808461
  let arr = new Array(height), i, l;
  for (i = 0, l = height; i < l; i++) {
    arr[i] = new Array(width);
  }
  return arr;
}

/**
 * Returns whether a character is a letter.
 * @param character the character to test
 * @returns 
 */
function IsAlpha(character: string): boolean {
  return /^[A-Z]$/i.test(character);
}

/**
 * Returns the number of days since the epoch.
 * @returns 
 */
function GetCurrentDaySinceEpoch(): number {
  const millis_per_day = 86400000n; // BigInt for 24 hrs/day * 60min/hr * 60sec/min * 1000ms/sec
  const now = BigInt(Date.now());
  return Number(now / millis_per_day);
}

export type WordlePageProps = {
  day?: number
};

export function WordlePage({day}: WordlePageProps) {
  /**
   * The actual word to guess. Undefined while loading.
   */
  const [actual_word, set_actual_word] = useState<string | undefined>();

  /**
   * The set of valid words. Undefined while loading
   */
  const [valid_words, set_valid_words] = useState<Set<string> | undefined>();

  /**
   * The array of guesses.
   */
  const [guesses, set_guesses] = useState<string[][]>(MakeArray(WORDLE_GUESSES, WORDLE_LENGTH));

  /**
   * The outcome of each guess. Only contains outcomes for up to the current number of guesses.
   */
  const [outcomes, set_outcomes] = useState<Outcome[][]>([]);

  /**
   * The outcomes of each letter. Used for coloring the keyboard.
   */
  const [letter_outcomes, set_letter_outcomes] = useState<Record<string, Outcome>>({}); 

  /**
   * The current number of guesses made.
   */
  const [current_guess, set_current_guess] = useState<number>(0);

  /**
   * The current character index.
   */
  const [current_char, set_current_char] = useState<number>(0);

  /**
   * The guess in which the game ended. Undefined while the game is still ongoing. -1 if the player lost.
   */
  const [success, set_success] = useState<number | undefined>();

  /**
   * Controls whether the modal is showing.
   */
  const [modal_show, set_modal_show] = useState<boolean>(false);

  //  References to the state variables.
  const guesses_ref = useRef(guesses);
  const current_guess_ref = useRef(current_guess);
  const current_char_ref = useRef(current_char);
  const success_ref = useRef(success);
  const outcomes_ref = useRef(outcomes);

  /**
   * Handles a guess being being submitted.
   * @returns the success stae
   */
  function HandleGuess(): [number | undefined, boolean] {
    const _guesses = guesses_ref.current;
    const _current_guess = current_guess_ref.current;
    const word = actual_word;
  
    let str = _guesses[_current_guess].join("");
  
    if (str.length !== WORDLE_LENGTH) {
      log.warn(`guess ${str} is somehow not the right length.`);
      return [success_ref.current, false];
    }
  
    str = str.toLowerCase();
  
    if (!valid_words?.has(str)) {
      log.log(`guess ${str} isn't a valid guess.`);
      toast(`${str.toUpperCase()} is not a valid word.`);
      return [success_ref.current, false];
    }
  
    const outcome = GenerateOutcomeString(str, word!);
    const updatedOutcomes = [...outcomes_ref.current];
    updatedOutcomes[_current_guess] = outcome;
    set_outcomes(updatedOutcomes);
  
    if (str == word) {
      success_ref.current = _current_guess;
    }
    else if(_current_guess + 1 == WORDLE_GUESSES) {
      success_ref.current = -1;
    }
  
    log.info(outcome);
    return [success_ref.current, true];
  }

  /**
   * Handles actions from the user.
   * @param action a character being added to the string or an "Enter"/"Backspace".
   */
  function OnAction(action: string) {
    if (success_ref.current != undefined || current_guess_ref.current >= WORDLE_GUESSES) {
      return;
    }
  
    const _guesses = [...guesses_ref.current];
    let _current_guess = current_guess_ref.current;
    let _current_char = current_char_ref.current;

    if (action === "Backspace" && _current_char > 0) {
      _guesses[_current_guess][_current_char - 1] = "";
      _current_char = Math.max(0, _current_char - 1);
    } else if (action === "Enter" && _current_char === WORDLE_LENGTH) {
      const [success_state, valid_guess] : [number | undefined, boolean] = HandleGuess();
      if(success_state != undefined) {
        set_success(success_state);
      }
      if(valid_guess) {
        _current_guess += 1;
        _current_char = 0;
      }
    } else if (IsAlpha(action) && _current_char < WORDLE_LENGTH) {
      _guesses[_current_guess][_current_char] = action.toUpperCase();
      _current_char += 1;
    }
  
    set_guesses(_guesses);
    set_current_guess(_current_guess);
    set_current_char(_current_char);
  }

  /**
   * Handles the key events.
   * @param event 
   * @returns 
   */
  function OnKeyDown(event: KeyboardEvent) {
    OnAction(event.key);
  }

  //  On initialization, fetch the data from the server.
  useEffect(() => {
    const days_since_epoch = day ?? GetCurrentDaySinceEpoch();

    GetValidWords().then((words) => {
      let _valid_words: Set<string> = new Set();
      for (let i = 0; i < words.length; i++) {
        _valid_words.add(words[i].toLowerCase());
      }
      set_valid_words(_valid_words);
    })

    setTimeout(() => {
      GetCurrentWordOfDay(days_since_epoch)
        .then((word) => {
          if (word != undefined) {
            set_actual_word(word);
          }
        })
    }, 0);

  }, []);

  // Keep refs in sync with latest state
  useEffect(() => {
    guesses_ref.current = guesses;
    current_guess_ref.current = current_guess;
    current_char_ref.current = current_char;
    success_ref.current = success;
    outcomes_ref.current = outcomes;
  }, [guesses, current_guess, current_char, success, outcomes]);

  //  Updates when the keypress event occurs.
  useEffect(() => {
    document.body.addEventListener("keydown", OnKeyDown);
    return () => {
      document.body.removeEventListener("keydown", OnKeyDown);
    };
  }, [guesses, current_guess, current_char, success]);

  //  Update the modal when the state of the wordle game changes.
  useEffect(() => {
    if(success != undefined) {
      set_modal_show(true);
    }
  }, [success]);

  //  Update the letter outcomes based on the outcomes.
  useEffect(() => {
    for(let i = 0; i < outcomes.length; i++) {
      for(let j = 0; j < outcomes[i].length; j++) {
        let char: string = guesses[i][j];
        letter_outcomes[char] = Math.max(letter_outcomes[char] ?? 0, outcomes[i][j]);
      }
    }
    set_letter_outcomes({...letter_outcomes});
  }, [outcomes]);

  return (
    <Page
      className="bg-surfacecontainer rounded-md p-8"
    >
      {
        actual_word != undefined && valid_words != undefined ?
          <>
            <div id="WordleBoard"
              data-testid="WordleBoard"
              className="flex flex-col"
            >
              {
                //  Make WORDLE_GUESSES number of rows
                Array.from({ length: WORDLE_GUESSES }).map((_, row_index) => (
                  <div key={row_index} className="flex flex-row justify-center">
                    {
                      Array.from({ length: WORDLE_LENGTH }).map((_, col_index) => (
                        //  Make WORDLE_LENGTH number of characters
                        <div key={col_index} className=" flex flex-row justify-center items-center">
                          {
                            <div 
                              className={`w-12 h-12 min-[450px]:w-16 min-[450px]:h-16 m-1 
                              bg-primarycontainer
                              flex flex-col justify-center align-middle
                              ${row_index < outcomes.length && col_index < outcomes[row_index].length ?
                                (
                                  outcomes[row_index][col_index] == Outcome.CORRECT ? "WordleBoard__Cell__Correct" :
                                    outcomes[row_index][col_index] == Outcome.IN_WORD ? "WordleBoard__Cell__In_Word" :
                                      outcomes[row_index][col_index] == Outcome.UNUSED ? "WordleBoard__Cell__Wrong" :
                                        ""
                                ) + " WordleBoard__Cell__Guessed "
                                : ""
                              }
                              ${guesses[row_index][col_index] ?
                                `WordleBoard__Cell__Filled border-secondary shadow-md` :
                                `border-secondary/20 shadow-2xs`
                              } border border-solid
                            `}
                            style={{
                              transitionDelay: row_index < outcomes.length && col_index < outcomes[row_index].length ? `${(col_index + 1) * 100}ms` :
                                "0",
                              animationDelay: row_index < outcomes.length && col_index < outcomes[row_index].length ? `${(col_index + 1) * 100}ms` :
                                "0"
                            }}
                            >
                              <Text
                                type="h2"
                                className="text-center font-bold"
                                text={guesses[row_index][col_index]}
                              />

                            </div>
                          }
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div> 
            <Keyboard key_outcomes={letter_outcomes} on_key_press={(key) => OnAction(key)}/>
          </>
          : <BeatLoader />
      }
      {
        success != undefined &&
        <Modal visible={modal_show} set_visible={set_modal_show}>
          <div className="p-8">
            {
              success >= 0 ? <Text>You guessed {actual_word} in {success + 1} guesses!</Text> :
                <Text>The answer was {actual_word}.</Text>
            }
          </div>
        </Modal>
      }
      <ToastContainer/>
    </Page>
  );
}


export default WordlePage;