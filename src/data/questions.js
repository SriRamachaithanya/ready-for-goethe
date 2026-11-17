// German content should be proofread by a German speaker before launch.

export const SKILLS = ["vocabulary", "grammar", "reading"];

export const questions = [
  { id: "v1", skill: "vocabulary", topic: "greetings", prompt: "Es ist 8 Uhr morgens. Was sagen Sie?", options: ["Gute Nacht", "Guten Morgen", "Guten Abend", "Auf Wiedersehen"], answerIndex: 1, explanation: "'Guten Morgen' is the morning greeting. 'Gute Nacht' is said before sleeping, 'Guten Abend' in the evening." },
  { id: "v2", skill: "vocabulary", topic: "numbers-time", prompt: "Es ist halb drei. Wie spät ist es?", options: ["2:30", "3:30", "2:15", "3:00"], answerIndex: 0, explanation: "'Halb drei' means half past two (2:30), not 3:30. Germans count towards the next hour." },
  { id: "v3", skill: "vocabulary", topic: "family", prompt: "Die Mutter von meiner Mutter ist meine ...", options: ["Tante", "Schwester", "Großmutter", "Tochter"], answerIndex: 2, explanation: "Your mother's mother is your 'Großmutter' (grandmother). 'Tante' is aunt." },
  { id: "v4", skill: "vocabulary", topic: "food-shopping", prompt: "Wo kaufen Sie Brot?", options: ["In der Apotheke", "In der Bäckerei", "Im Kino", "In der Bibliothek"], answerIndex: 1, explanation: "You buy bread 'in der Bäckerei' (at the bakery). 'Apotheke' is a pharmacy." },
  { id: "g1", skill: "grammar", topic: "articles", prompt: "___ Buch ist interessant.", options: ["Der", "Die", "Das", "Den"], answerIndex: 2, explanation: "'Buch' is neuter, so it takes 'das'. Learn every noun together with its article." },
  { id: "g2", skill: "grammar", topic: "verb-conjugation", prompt: "Maria ___ in Berlin.", options: ["wohne", "wohnst", "wohnen", "wohnt"], answerIndex: 3, explanation: "With er/sie/es the regular verb ends in -t: 'sie wohnt'. 'Wohne' goes with 'ich'." },
  { id: "g3", skill: "grammar", topic: "word-order", prompt: "Welcher Satz ist richtig?", options: ["Heute ich gehe ins Kino.", "Ich heute gehe ins Kino.", "Gehe heute ich ins Kino.", "Heute gehe ich ins Kino."], answerIndex: 3, explanation: "The verb must be in second position. After 'Heute' comes the verb 'gehe', then the subject 'ich'." },
  { id: "g4", skill: "grammar", topic: "negation", prompt: "Ich habe ___ Zeit.", options: ["nicht", "kein", "keine", "keinen"], answerIndex: 2, explanation: "Use 'kein-' to negate a noun. 'Zeit' is feminine, so the form is 'keine Zeit'." },
  { id: "r1", skill: "reading", topic: "reading-messages", passage: "Liebe Nachbarn,\nam Samstag feiere ich meinen Geburtstag. Die Party beginnt um 19 Uhr. Ich wohne in der Lindenstraße 5, im zweiten Stock. Bitte bringt keine Geschenke mit, aber gern etwas zu essen.\nViele Grüße\nAnna", prompt: "Wann beginnt die Party?", options: ["17 Uhr", "19 Uhr", "9 Uhr", "20 Uhr"], answerIndex: 1, explanation: "The text says 'um 19 Uhr' (at 7 pm). Always look for numbers and time words in the text." },
  { id: "r2", skill: "reading", topic: "reading-messages", passage: "Liebe Nachbarn,\nam Samstag feiere ich meinen Geburtstag. Die Party beginnt um 19 Uhr. Ich wohne in der Lindenstraße 5, im zweiten Stock. Bitte bringt keine Geschenke mit, aber gern etwas zu essen.\nViele Grüße\nAnna", prompt: "Was sollen die Gäste mitbringen?", options: ["Geschenke", "Blumen", "Getränke", "etwas zu essen"], answerIndex: 3, explanation: "'Keine Geschenke' means no gifts, but 'gern etwas zu essen' means something to eat is welcome." },
  { id: "r3", skill: "reading", topic: "reading-notices", passage: "Stadtbibliothek\nÖffnungszeiten:\nMontag bis Freitag: 9–18 Uhr\nSamstag: 10–14 Uhr\nSonntag: geschlossen", prompt: "Wann ist die Bibliothek am Samstag geöffnet?", options: ["9–18 Uhr", "10–18 Uhr", "10–14 Uhr", "geschlossen"], answerIndex: 2, explanation: "Find the line that starts with 'Samstag': it says 10–14 Uhr. Do not mix up weekday and weekend hours." },
  { id: "r4", skill: "reading", topic: "reading-notices", passage: "Stadtbibliothek\nÖffnungszeiten:\nMontag bis Freitag: 9–18 Uhr\nSamstag: 10–14 Uhr\nSonntag: geschlossen", prompt: "Sie möchten am Sonntag ein Buch ausleihen. Was ist richtig?", options: ["Das geht nicht. Die Bibliothek ist geschlossen.", "Sie können von 10 bis 14 Uhr kommen.", "Sie können bis 18 Uhr kommen.", "Sie können am Morgen kommen."], answerIndex: 0, explanation: "'Sonntag: geschlossen' means closed on Sunday. 'Geschlossen' is a very common word on notices." },
];

export const practiceTips = {
  greetings: "Practise greetings for different times of day (Guten Morgen, Guten Tag, Guten Abend, Gute Nacht).",
  "numbers-time": "Practise telling the time, especially 'halb' (half to the NEXT hour), and numbers up to 100.",
  family: "Review family words (Mutter, Vater, Großmutter, Bruder, Schwester, Tante) and make short sentences about your family.",
  "food-shopping": "Learn the common shops and what you buy there (Bäckerei, Supermarkt, Apotheke) and practise shopping phrases.",
  articles: "Practise der/die/das with 10 everyday nouns a day. Always learn the noun together with its article.",
  "verb-conjugation": "Drill present-tense endings for ich/du/er/wir/ihr/sie with 5 regular verbs, plus sein and haben.",
  "word-order": "Practise main-clause word order: the verb always comes second, even if the sentence starts with a time word.",
  negation: "Practise 'nicht' versus 'kein-': use kein- for nouns (keine Zeit) and nicht for verbs and adjectives.",
  "reading-messages": "Read short messages and emails, and underline times, days and places before answering.",
  "reading-notices": "Practise reading signs and timetables (Öffnungszeiten, geschlossen, geöffnet) and match each day to its hours.",
};
