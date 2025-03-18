import { Family } from '../Components/FamilyManagement/FamilyContext';
import { type User } from '../Components/UserManagement/UserContext';
const authKey = 'um.auth';

export type Auth = {
  user: User;
  token: string;
};

export type SignUpUser = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export async function requestSignUp(userData: SignUpUser): Promise<Auth> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  };
  const res = await fetch('/api/auth/sign-up', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return (await res.json()) as Auth;
}

export type SignInUser = {
  username: string;
  password: string;
};

export async function requestSignIn(userData: SignInUser): Promise<Auth> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  };
  const res = await fetch('/api/auth/sign-in', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return (await res.json()) as Auth;
}

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export type CreateFamilyData = {
  familyName: string;
  password: string;
};

type CreateFamilyResponse = {
  familyId: number;
  familyName: string;
  createdAt: string;
};

export async function createFamily(
  familyData: CreateFamilyData
): Promise<CreateFamilyResponse> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(familyData),
  };
  const res = await fetch('/api/auth/create-family', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export type JoinFamilyData = {
  familyId: string | number;
  password: string;
};

export async function joinFamily(
  familyData: JoinFamilyData
): Promise<Family[]> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(familyData),
  };
  const res = await fetch('/api/auth/join-family', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  const { userId } = await res.json();
  return await requestFamilyDetails(userId);
}

export async function requestFamilyDetails(
  userId: number | undefined
): Promise<Family[]> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ userId }),
  };

  const res = await fetch('/api/family-details', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Family[];
}
