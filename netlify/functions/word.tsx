import { readFileSync } from 'fs';
import { join } from 'path';

import type { Context } from '@netlify/functions';

/**
 * Retrieve a word from the list, deterministically chosen by the date.
 */
export default async (request: Request, context: Context) => {
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
    let word = lines[Math.abs(date % lines.length)];
    return Response.json(word.trim());
  }
  catch (error) {
    return Response.error();
  }
}