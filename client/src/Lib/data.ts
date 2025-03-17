import { User } from '../Components/UserManagement/UserContext';
const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export type SignUpUser = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export type SignInUser = {
  username: string;
  password: string;
};

export type CreateFamilyData = {
  familyName: string;
  password: string;
};

export type JoinFamilyData = {
  familyId: string;
  password: string;
};

export async function requestSignUp(userData: SignUpUser) {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  };
  const res = await fetch('/api/auth/sign-up', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  const { user, token } = (await res.json()) as Auth;
  return [user, token];
}

export async function requestSignIn(userData: SignInUser) {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  };
  const res = await fetch('/api/auth/sign-in', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  const { user, token } = (await res.json()) as Auth;
  return [user, token];
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

export async function requestFamilyDetails() {
  const user = readUser();
  const { userId } = user as User;
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
  return await res.json();
}

export async function createFamily(familyData: CreateFamilyData) {
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

export async function joinFamily(familyData: JoinFamilyData) {
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
  return await res.json();
}
