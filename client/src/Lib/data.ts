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

export type Image = {
  imageId: number;
  userId: number;
  familyId: number;
  imageUrl: string;
  caption: string;
};

export async function readImages(
  familyId: number | undefined
): Promise<Image[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/family/${familyId}/dashboard/images`, req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function readImage(
  familyId: number | undefined,
  imageId: number | undefined
): Promise<Image> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/images/${imageId}`,
    req
  );
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function uploadImage(
  imageData: FormData,
  familyId: number | undefined
): Promise<Image> {
  const res = await fetch(`/api/family/${familyId}/dashboard/image-uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
    body: imageData,
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export type Recipe = {
  recipeId: number;
  userId: number;
  familyId: number;
  dishName: string;
  category: string;
  cookingTime: string;
  ingredients: string;
  directions: string;
  notes: string;
};

export async function readRecipes(
  familyId: number | undefined
): Promise<Recipe[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/family/${familyId}/dashboard/recipes`, req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function uploadRecipe(
  recipeData: Partial<Recipe>,
  familyId: number
): Promise<Recipe> {
  const res = await fetch(`/api/family/${familyId}/dashboard/recipe-uploads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export type Story = {
  storyId: number;
  userId: number;
  familyId: number;
  title: string;
  content: string;
};

export async function readStories(
  familyId: number | undefined
): Promise<Story[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/family/${familyId}/dashboard/stories`, req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function readStory(
  familyId: number | undefined,
  storyId: number | undefined
): Promise<Story> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/stories/${storyId}`,
    req
  );
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function uploadStory(
  storyData: Partial<Story>,
  familyId: number
): Promise<Story> {
  const res = await fetch(`/api/family/${familyId}/dashboard/story-uploads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(storyData),
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}
