import { Text } from "components/Text";
import { Outcome } from "logic/wordle";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export type KeyboardProps = {
  /**
   * The status of each key.
   */
  key_outcomes: Record<string, Outcome>

  /**
   * Callback that is invoked when a key is pressed.
   * @param key the key of the button
   */
  on_key_press: (key: string) => void
};

export function Keyboard({ key_outcomes, on_key_press }: KeyboardProps): JSX.Element {
  return (
    <div className="space-y-1 w-full max-w-md mx-auto my-4">
      {KEYBOARD_ROWS.map((row, row_index) => (
        <div key={row_index} className="flex justify-center gap-1">
          {row.map((key) => (
            <div
              key={key}
              className={`rounded-sm p-2
              font-bold cursor-pointer box-border
              ${
                key in key_outcomes ?
                  (key_outcomes[key] == Outcome.CORRECT ? "WordleBoard__Cell__Correct" :
                  key_outcomes[key] == Outcome.IN_WORD ? "WordleBoard__Cell__In_Word" :
                  key_outcomes[key] == Outcome.UNUSED ? "WordleBoard__Cell__Wrong" : "") :
                "bg-surfacevariant"
              }
              border-2 border-transparent hover:border-primary hover:border-solid
              `}
              // tabIndex={row_index + 1}
              onClick={() => on_key_press(key)}
            >
              <Text text={key} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;