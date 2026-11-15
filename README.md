# Rep Max 🏋️

A revision game for A-level **Maths** (AQA 7357), **Further Maths** (AQA 7367, core with the Mechanics and Discrete options), **Chemistry** (AQA 7405) and **Computer Science** (OCR H446), with a **course map** for each.

It also has a **GCSE** side: a course map and tracker for English Language and Literature, Maths, Biology, Chemistry, Physics, Religious Studies, History, Design and Technology, and Business (quizzes to come). The first screen asks which course you're doing; add `?p=alevel` or `?p=gcse` to the address to go straight there.

It runs in a browser on a phone or laptop. There are no accounts and nothing to install, though adding it to your home screen keeps your progress safe.

## Ways to play

| Mode | What it is |
|---|---|
| **Solo gym** | Quick 5, Warm-up (level 1), Working sets (levels 1–2), 1-rep max (the hardest) or Weak spots (questions you missed, brought back on a spaced-repetition timer). Optional clock. |
| **Daily challenge** | 10 questions a day from the topics you've covered. No clock unless you switch it on. It only counts once you finish. Friends who have ticked the same topics get the same 10. |
| **Quiz night** | Host on a laptop or TV; friends join with a 4-letter code or the QR code. A right answer scores 800, plus up to 200 for speed. "Play again" keeps the room. |
| **Spec tracker** | Every topic of all four courses, how strong you are on each, a Key idea card for some topics, and Train for one topic. |
| **What I've covered** | Tell it what you've had in class; workouts, quiz nights and the daily challenge then stick to that. "Not done this topic yet" under any question does the same in one tap. |
| **Write a question** | Build a new question, preview it, copy the line into the bank. |

## The questions

**They were written by AI and checked by a second AI.** Every calculation and code trace was re-run in Python, and an independent review of 125 of the first 248 found no wrong answer. Some will still be wrong. Under every question there's **Report a problem**, which copies the question and its id so you can send it on, or fix it yourself.

The calculation questions for binary and hex, moles, suvat, discriminants, complex numbers and so on come from **number generators** (`data/generators.js`). They make fresh numbers every time and work the answer out in code.

## Adding or fixing questions

Questions live in plain files, **one question per line** ([JSON Lines](https://jsonlines.org/)):

```
data/alevel/maths.jsonl   data/alevel/further.jsonl   data/alevel/chem.jsonl   data/alevel/cs.jsonl
data/alevel/cards.jsonl   (Key idea cards)   data/alevel/spec.js (course map)   data/alevel/generators.js
data/gcse/spec.js         (GCSE course map; no questions yet)
```

A line looks like this:

```json
{"id":"cs-201","s":"cs","t":"1.4.1","lv":1,"q":"What is 0x2F in denary?","o":["47","45","32","215"],"a":0,"x":"2 × 16 + 15 = 47."}
```

- `t` is a topic id from `data/alevel/spec.js`, `lv` is 1, 2 or 3, `a` is the index (0–3) of the right option, `x` is the explanation.
- Maths goes between `$` signs and is drawn with KaTeX; backslashes are doubled (`$\\frac{1}{2}$`).
- Optional `"code"` holds a program, shown with line numbers (`\n` between lines).
- The **Write a question** screen builds the line for you.

To add one, open the file on GitHub, click the pencil, paste your line at the end and commit. The site updates a minute or two later. A broken line is skipped and listed at the bottom of the home screen; the rest of the subject still works.

## How it works

- **No framework, no server.** `index.html` (vanilla JavaScript and CSS), the data files, and `lib/` (KaTeX, MQTT.js and a QR library, shipped with the game so it still works where a school blocks those websites). Hosted free on GitHub Pages.
- **Daily challenge without a server:** the date is hashed (FNV-1a) into a seed for a small PRNG (mulberry32), so devices with the same topics ticked pick the same 10 questions and the same generated numbers.
- **Weak spots:** Leitner boxes. A right answer moves a question up a box (review after 1, 3, 7, 14 days); a wrong one sends it back to box 0.
- **Quiz night:** devices talk through public MQTT brokers over secure WebSockets. Each message goes through three brokers and duplicates are dropped on arrival. The host's browser keeps the answer key, times each question and does the scoring; phones only send their pick. The host re-sends the current state every 3 seconds, so a phone that drops a message, refreshes or joins late catches up.
- **Progress** is stored with `localStorage` on each device; Settings has a backup code that merges progress between devices.

Things you could build: type-in numeric answers, a head-to-head mode, more generators, the second Further Maths option.

## Privacy

Use nicknames. In quiz night, nicknames and answers pass through public relay servers. Nothing else leaves your device.
