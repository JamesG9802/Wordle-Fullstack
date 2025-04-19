import { readFileSync } from 'fs';
import log from 'loglevel';
import { join } from 'path';

/**
 * Retrieve a word from the list, deterministically chosen by the date.
 */
export default async function word(request: Request) {
  let date: number | undefined = Number.parseInt(new URL(request.url).searchParams.get("day") ?? "");
  
  if(Number.isNaN(date)) {
    date = undefined;
  }

  //  Pick a random word from the file list
  try {
    // Build path to the text file
    const file_path: string = join(process.cwd(), "data", "possible_words.txt");

    const contents = readFileSync(file_path, "ascii");
    const lines: string[] = contents.trim().split("\n");

    //  Validate request
    if (date == undefined || !Number.isInteger(date)) {
      date = Math.floor(Math.random() * lines.length);
    }
    const word = lines[Math.abs(date % lines.length)];
    return Response.json(word.trim());
  }
  catch (error) {
    log.error(error);
    return Response.error();
  }
}