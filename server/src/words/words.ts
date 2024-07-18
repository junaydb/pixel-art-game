import fs from "node:fs";
import path from "node:path";
import chokidar from "chokidar";
import { randInRange } from "@/util/helpers";
import { logEnabled } from "@/util/logger";

let words: string[];

const wordFile = path.join(__dirname, "words.txt");

function loadWords() {
  try {
    words = fs
      .readFileSync(wordFile, "utf8")
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word !== "");
  } catch (err) {
    console.error(err);
  }
}

function getUniqueRandomWords(count: number, used: Set<string>) {
  const wordOptions: string[][] = [];

  while (wordOptions.length < count) {
    const word: string | string[] = words[randInRange(0, words.length)];

    if (used.has(word)) continue;

    wordOptions.push(word.split(" "));
    used.add(word);
  }

  return wordOptions;
}

loadWords();

if (process.env.NODE_ENV !== "test") {
  const watcher = chokidar.watch(wordFile);
  watcher.on("change", () => {
    loadWords();
    if (logEnabled) console.log("words.txt: updated");
  });
}

export { getUniqueRandomWords };
