/**
 * Lightweight client-side auth for the demo.
 *
 * NOTE: This is NOT production-grade security. Users and password hashes live
 * in localStorage, the hash is unsalted SHA-256, and everything runs in the
 * browser. A real deployment must move authentication to a backend. The goal
 * here is only to provide a believable flow that actually validates
 * credentials instead of accepting anything.
 */

export interface SessionUser {
  fullname: string;
  email: string;
  joinDate: string;
  phone: string;
  address: string;
}

interface StoredUser extends SessionUser {
  passwordHash: string;
}

export type AuthErrorCode = 'NO_USER' | 'BAD_PASSWORD' | 'EMAIL_TAKEN';

const USERS_KEY = 'users';
const SESSION_KEY = 'currentUser';

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function stripPassword({ passwordHash, ...session }: StoredUser): SessionUser {
  return session;
}

function setSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  // Notify listeners (Navbar, Dashboard) that the session changed.
  window.dispatchEvent(new Event('storage'));
}

export function getCurrentUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export interface SignupInput {
  fullname: string;
  email: string;
  password: string;
  joinDate: string;
}

export async function signup(input: SignupInput): Promise<{ error?: AuthErrorCode }> {
  const email = input.email.trim().toLowerCase();
  const users = loadUsers();

  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { error: 'EMAIL_TAKEN' };
  }

  const user: StoredUser = {
    fullname: input.fullname.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    joinDate: input.joinDate,
    phone: '',
    address: '',
  };

  users.push(user);
  saveUsers(users);
  setSession(stripPassword(user));
  return {};
}

export async function login(
  emailInput: string,
  password: string
): Promise<{ error?: AuthErrorCode }> {
  const email = emailInput.trim().toLowerCase();
  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email);

  if (!user) return { error: 'NO_USER' };
  if (user.passwordHash !== (await hashPassword(password))) {
    return { error: 'BAD_PASSWORD' };
  }

  setSession(stripPassword(user));
  return {};
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('storage'));
}

/** Updates the active session and mirrors the change into the users registry. */
export function updateCurrentUser(patch: Partial<Omit<SessionUser, 'email'>> & { email?: string }) {
  const current = getCurrentUser();
  if (!current) return;

  const updated: SessionUser = { ...current, ...patch };
  setSession(updated);

  const users = loadUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === current.email.toLowerCase());
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...patch };
    saveUsers(users);
  }
}
