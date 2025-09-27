// Category, author, and co-author options for the article writer
export const CATEGORY_CHOICES = [
  { value: "BREAKING_NEWS", label: "Breaking News" },
  { value: "ECONOMY", label: "Economy" },
  { value: "POLITICS", label: "Politics" },
  { value: "FOREIGN_AFFAIRS", label: "Foreign Affairs" },
  { value: "IMMIGRATION", label: "Immigration" },
  { value: "HUMAN_RIGHTS", label: "Human Rights" },
  { value: "LEGISLATION", label: "Legislation" },
  { value: "OPINION", label: "Opinion" },
] as const;

export const authorOptions = [
  { value: "1", label: "Admin" },
];

export const coAuthorOptions = [
  { value: "", label: "None" },
  // ...
];
