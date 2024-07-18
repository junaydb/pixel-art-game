import { getUniqueRandomWords } from "@/words/words";

describe("getUniqueRandomWords", () => {
  it("Should not contain used words", () => {
    for (let i = 0; i < 1000; i++) {
      const used = new Set(["seashell", "washing machine", "snowball"]);
      const usedIter = used.values();
      const randomWords = getUniqueRandomWords(3, used);

      for (let i = 0; i < randomWords.length; i++) {
        expect(randomWords[i].join(" ")).not.toEqual(usedIter.next().value);
      }
    }
  });

  it("Should not return 2d array containing multiple arrays with identical string(s)", () => {
    for (let i = 0; i < 1000; i++) {
      const used = new Set(["electricity", "fairy", "bunny hop"]);
      const randomWords = getUniqueRandomWords(3, used);

      for (let i = 0; i < randomWords.length; i++) {
        for (let j = 0; j < randomWords.length; j++) {
          if (i === j) continue;
          expect(randomWords[i].join(" ")).not.toEqual(
            randomWords[j].join(" "),
          );
        }
      }
    }
  });
});
