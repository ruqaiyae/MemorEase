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

export type FamilyAuth = {
  family: Family;
};

export function saveFamilyAuth(family: Family): void {
  const familyAuth: FamilyAuth = { family };
  localStorage.setItem('familyAuthKey', JSON.stringify(familyAuth));
}

export function removeFamilyAuth(): void {
  localStorage.removeItem('familyAuthKey');
}

export function readFamily(): Family | undefined {
  const familyAuth = localStorage.getItem('familyAuthKey');
  if (!familyAuth) return undefined;
  return (JSON.parse(familyAuth) as FamilyAuth).family;
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

export async function readImages(familyId: number): Promise<Image[]> {
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
  familyId: number,
  imageId: number
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
  familyId: number
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

export async function updateImage(
  image: FormData,
  familyId: number,
  imageId: number
): Promise<Image> {
  const req = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
    body: image,
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/images/${imageId}/edit`,
    req
  );
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Image;
}

export async function deleteImage(
  familyId: number,
  imageId: number
): Promise<void> {
  const bear = readToken();
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${bear}`,
    },
  };
  const response = await fetch(
    `/api/family/${familyId}/dashboard/images/${imageId}/edit`,
    req
  );
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
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
  creator: string;
  backstory: string;
  notes: string;
};

export async function readRecipes(familyId: number): Promise<Recipe[]> {
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

export async function readRecipe(
  familyId: number,
  recipeId: number
): Promise<Recipe> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/recipes/${recipeId}`,
    req
  );
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

export async function updateRecipe(
  recipe: Partial<Recipe>,
  familyId: number,
  recipeId: number
): Promise<Recipe> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(recipe),
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/recipes/${recipeId}/edit`,
    req
  );
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Recipe;
}

export async function deleteRecipe(
  familyId: number,
  recipeId: number
): Promise<void> {
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(
    `/api/family/${familyId}/dashboard/recipes/${recipeId}/edit`,
    req
  );
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
}

export type Story = {
  storyId: number;
  userId: number;
  familyId: number;
  title: string;
  content: string;
  author: string;
};

export async function readStories(familyId: number): Promise<Story[]> {
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
  familyId: number,
  storyId: number
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

export async function updateStory(
  story: Partial<Story>,
  familyId: number,
  storyId: number
): Promise<Story> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(story),
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/stories/${storyId}/edit`,
    req
  );
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Story;
}

export async function deleteStory(
  familyId: number,
  storyId: number
): Promise<void> {
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(
    `/api/family/${familyId}/dashboard/stories/${storyId}/edit`,
    req
  );
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
}

export type Video = {
  videoId: number;
  userId: number;
  familyId: number;
  videoUrl: string;
  caption: string;
};

export async function readVideos(familyId: number): Promise<Video[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/family/${familyId}/dashboard/videos`, req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function readVideo(
  familyId: number,
  videoId: number
): Promise<Video> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/videos/${videoId}`,
    req
  );
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function uploadVideo(
  videoData: FormData,
  familyId: number
): Promise<Video> {
  const res = await fetch(`/api/family/${familyId}/dashboard/video-uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
    body: videoData,
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function updateVideo(
  video: FormData,
  familyId: number,
  videoId: number
): Promise<Video> {
  const req = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
    body: video,
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/videos/${videoId}/edit`,
    req
  );
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Video;
}

export async function deleteVideo(
  familyId: number,
  videoId: number
): Promise<void> {
  const bear = readToken();
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${bear}`,
    },
  };
  const response = await fetch(
    `/api/family/${familyId}/dashboard/videos/${videoId}/edit`,
    req
  );
  if (!response.ok) {
    throw new Error(`response status: ${response.status}`);
  }
}

export type LikeMemory = {
  userId: number;
  familyId: number;
  imageId?: number;
  recipeId?: number;
  storyId?: number;
  videoId?: number;
};

export async function readImageLike(
  familyId: number,
  imageId: number
): Promise<LikeMemory | undefined> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/images/${imageId}/readLike`,
    req
  );
  return await res.json();
}

export async function readRecipeLike(
  familyId: number,
  recipeId: number | undefined
): Promise<LikeMemory | undefined> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/recipes/${recipeId}/readLike`,
    req
  );
  return await res.json();
}

export async function readStoryLikes(
  familyId: number,
  storyId: number
): Promise<LikeMemory[] | undefined> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/stories/${storyId}/readLike`,
    req
  );
  return await res.json();
}

export async function readVideoLike(
  familyId: number,
  videoId: number
): Promise<LikeMemory | undefined> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(
    `/api/family/${familyId}/dashboard/videos/${videoId}/readLike`,
    req
  );
  return await res.json();
}

export async function likeMemory(
  familyId: number,
  memoryType: string,
  memoryId: number
): Promise<LikeMemory> {
  let desiredColumn;

  if (!memoryType) throw new Error('Memory type is missing');
  if (memoryType === 'image') desiredColumn = 'imageId';
  if (memoryType === 'recipe') desiredColumn = 'recipeId';
  if (memoryType === 'story') desiredColumn = 'storyId';
  if (memoryType === 'video') desiredColumn = 'videoId';

  const res = await fetch(`/api/family/${familyId}/dashboard/like-memory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ memoryId, desiredColumn }),
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function dislikeMemory(
  familyId: number,
  memoryType: string,
  memoryId: number
): Promise<void> {
  let desiredColumn;
  if (!memoryType) throw new Error('Memory type is missing');
  if (memoryType === 'image') desiredColumn = 'imageId';
  if (memoryType === 'recipe') desiredColumn = 'recipeId';
  if (memoryType === 'story') desiredColumn = 'storyId';
  if (memoryType === 'video') desiredColumn = 'videoId';

  const res = await fetch(`/api/family/${familyId}/dashboard/dislike-memory`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ memoryId, desiredColumn }),
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
}

export type Comment = {
  commentsId: number;
  userId?: number;
  familyId?: number;
  imageId?: number;
  recipeId?: number;
  storyId?: number;
  videoId?: number;
  author: string | undefined;
  comment: string;
};

export async function readImageComment(
  familyId: number,
  imageId: number
): Promise<Comment[]> {
  const res = await fetch(
    `/api/family/${familyId}/dashboard/images/${imageId}/readComment`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${readToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function readVideoComment(
  familyId: number,
  videoId: number
): Promise<Comment[]> {
  const res = await fetch(
    `/api/family/${familyId}/dashboard/videos/${videoId}/readComment`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${readToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function addComment(
  familyId: number,
  memoryType: string,
  memoryId: number,
  author: string | undefined,
  comment: string
): Promise<Comment> {
  let desiredColumn;

  if (!memoryType) throw new Error('Memory type is missing');
  if (memoryType === 'image') desiredColumn = 'imageId';
  if (memoryType === 'story') desiredColumn = 'storyId';
  if (memoryType === 'video') desiredColumn = 'videoId';

  const res = await fetch(`/api/family/${familyId}/dashboard/add-comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ memoryId, desiredColumn, author, comment }),
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  return await res.json();
}

export async function deleteComment(
  commentId: number,
  familyId: number,
  memoryType: string,
  memoryId: number
): Promise<void> {
  let desiredColumn;
  if (!memoryType) throw new Error('Memory type is missing');
  if (memoryType === 'image') desiredColumn = 'imageId';
  if (memoryType === 'recipe') desiredColumn = 'recipeId';
  if (memoryType === 'story') desiredColumn = 'storyId';
  if (memoryType === 'video') desiredColumn = 'videoId';

  const res = await fetch(`/api/family/${familyId}/dashboard/delete-comment`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ commentId, memoryId, desiredColumn }),
  });

  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
}
