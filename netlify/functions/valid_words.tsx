import { readFileSync } from 'fs';
import { join } from 'path';

import type { Context } from '@netlify/functions';

/**
 * Get the list of valid words.
 */
export default async (_: Request, __: Context) => {
  //  Pick a random word from the file list
  try {
    // Build path to the text file
    const file_path: string = join(process.cwd(), "data", "valid_words.txt");

    const contents = readFileSync(file_path, "ascii");
    const lines: string[] = contents.trim().split("\n");

    //  preprocess
    for(let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }

    return Response.json(lines);
  }
  catch (error) {
    return Response.error();
  }
}