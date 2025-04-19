import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WORDLE_GUESSES } from "logic/wordle";
import WordlePage from "..";


describe("WordlePage", () => {
    //   it("renders loading spinner while fetching", () => {
    //     render(<WordlePage />);
    //     expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    //   });

    it("renders the board after loading", async () => {
        render(<WordlePage />);
        await waitFor(() => {
            const board = screen.queryByTestId("WordleBoard");
            expect(board).not.toBeNull();
        });
    });

    it("allows typing letters", async () => {
        render(<WordlePage />);
        await waitFor(() => screen.getByTestId("WordleBoard"));

        for (const char of "abcde") {
            fireEvent.keyDown(document.body, { key: char });
        }

        expect(screen.getAllByText(`A`).length).toBe(2)
        expect(screen.getAllByText(`B`).length).toBe(2)
        expect(screen.getAllByText(`C`).length).toBe(2)
        expect(screen.getAllByText(`D`).length).toBe(2)
        expect(screen.getAllByText(`E`).length).toBe(2)
    });

    it("allows typing letters and deleting letters", async () => {
        render(<WordlePage />);
        await waitFor(() => screen.getByTestId("WordleBoard"));

        for (const char of "abcde") {
            fireEvent.keyDown(document.body, { key: char });
        }

        fireEvent.keyDown(document.body, { key: "Backspace" });

        expect(screen.getAllByText(`A`).length).toBe(2)
        expect(screen.getAllByText(`B`).length).toBe(2)
        expect(screen.getAllByText(`C`).length).toBe(2)
        expect(screen.getAllByText(`D`).length).toBe(2)
        expect(screen.getAllByText(`E`).length).toBe(1)
    });

    it("allows typing letters and submitting wrong guesses", async () => {
        render(<WordlePage day={0}/>);
        await waitFor(() => screen.getByTestId("WordleBoard"));

        for(let i = 0; i < WORDLE_GUESSES; i++) {
            for (const char of "SCRAM") {
                fireEvent.keyDown(document.body, { key: char });
            }
            //  Random input
            fireEvent.keyDown(document.body, { key: "A" });
    
            fireEvent.keyDown(document.body, { key: "Enter" });
        }

        //  Random input
        fireEvent.keyDown(document.body, { key: "A" });

        expect(screen.getAllByText(`S`).length).toBe(WORDLE_GUESSES + 1);
        expect(screen.getAllByText(`C`).length).toBe(WORDLE_GUESSES + 1);
        expect(screen.getAllByText(`R`).length).toBe(WORDLE_GUESSES + 1);
        expect(screen.getAllByText(`A`).length).toBe(WORDLE_GUESSES + 1);
        expect(screen.getAllByText(`M`).length).toBe(WORDLE_GUESSES + 1);

        expect(screen.getByText(/The answer was .*/)).not.toBe(null);
    });
    
    //   it("shows failure message on exhausting all attempts", async () => {
    //     render(<WordlePage />);
    //     await waitFor(() => screen.getByTestId("WordleBoard"));

    //     // Wrong guess
    //     for (let i = 0; i < 6; i++) {
    //       for (const char of "apple") {
    //         fireEvent.keyDown(document.body, { key: char });
    //       }
    //       fireEvent.keyDown(document.body, { key: "Enter" });
    //     }

    //     await waitFor(() =>
    //       expect(screen.getByText(`The answer was ${mockWord}.`)).toBeInTheDocument()
    //     );
    //   });
});
