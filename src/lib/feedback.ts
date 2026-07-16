// Portal feedback store.
//
// MOCK implementation: feedback is persisted to localStorage, so it is only
// visible in the same browser. This is enough to build and demo the flow.
//
// To make feedback real (cross-user), replace the body of `addFeedback` with a
// POST to a serverless function that creates a `feedback` document in Sanity,
// and replace `listFeedback` with a Sanity query (GROQ) of those documents.
// The shape below maps 1:1 to a Sanity `feedback` document, so the UI stays.

export type FeedbackCategory = "idea" | "bug" | "content" | "other";

export interface FeedbackEntry {
  id: string;
  message: string;
  category: FeedbackCategory;
  page: string; // pathname the feedback was sent from
  email?: string; // optional contact
  createdAt: number; // epoch ms
  read: boolean;
}

const STORAGE_KEY = "portal-feedback";

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  idea: "Idea",
  bug: "Bug",
  content: "Content",
  other: "Other",
};

function read(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: FeedbackEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function listFeedback(): FeedbackEntry[] {
  // Newest first.
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addFeedback(input: {
  message: string;
  category: FeedbackCategory;
  page: string;
  email?: string;
}): FeedbackEntry {
  const entry: FeedbackEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message: input.message.trim(),
    category: input.category,
    page: input.page,
    email: input.email?.trim() || undefined,
    createdAt: Date.now(),
    read: false,
  };
  write([entry, ...read()]);
  return entry;
}

export function markRead(id: string) {
  write(read().map((e) => (e.id === id ? { ...e, read: true } : e)));
}

export function markAllRead() {
  write(read().map((e) => ({ ...e, read: true })));
}

export function unreadCount(): number {
  return read().filter((e) => !e.read).length;
}
