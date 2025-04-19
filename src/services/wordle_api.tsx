import log from "loglevel";

/**
 * The app's base API endpoint.
 */

let API_ENDPOINT: string = "https://willowy-brioche-b89881.netlify.app/.netlify/functions/";

if (import.meta.env.DEV) {
    API_ENDPOINT = `http://localhost:3000/.netlify/functions`;
}

/**
 * Get the current wordle word
 * @param day the number of days since the epoch
 * @returns the current wordle word from the api
 */
export async function GetCurrentWordOfDay(day: number, max_retries: number = 5): Promise<string | undefined> {
    let attempt = 0;
    let delay = 1;

    while (attempt <= max_retries) {
        try {
            const response = await fetch(`${API_ENDPOINT}/word?day=${day}`);

            if (!response.ok) {
                throw new Error("Bad response");
            }

            const text = await response.text();
            return text.replace(/^\"+|\"+$/g, '');
        } catch (error) {
            log.error(`Attempt ${attempt + 1} failed: ${error}`);

            if (attempt === max_retries) {
                log.error("Max retries reached. Giving up.");
                return;
            }
            
            // Wait before retrying
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2; // Exponential backoff
            attempt++;
        }
    }
} 

export async function GetValidWords(max_retries: number = 5): Promise<any> {
    let attempt = 0;
    let delay = 1;

    while (attempt <= max_retries) {
        try {
            const response = await fetch(`${API_ENDPOINT}/valid_words`);
            if (!response.ok) {
                throw new Error("Bad response");
            }

            const text = await response.json();
            return text;
        } catch (error) {
            log.error(`Attempt ${attempt + 1} failed: ${error}`);

            if (attempt === max_retries) {
                log.error("Max retries reached. Giving up.");
                return;
            }
            
            // Wait before retrying
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2; // Exponential backoff
            attempt++;
        }
    }
}