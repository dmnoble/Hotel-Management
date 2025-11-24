// DEV-ONLY AUTH STUB
// This file replaces the Supabase-based implementation during early Franken-JRPG phases.
// It uses localStorage to fake a "logged-in user" so the rest of the app keeps working.

const STORAGE_KEY = "franken-dev-user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

// Shape similar to Supabase user: includes role + user_metadata
function makeUser({ fullName, email }) {
  return {
    id: "dev-user-1",
    email,
    role: "authenticated",
    user_metadata: {
      fullName,
      avatar: "",
    },
    created_at: new Date().toISOString(),
  };
}

// Match: export async function signup({ fullName, email, password })
// password is ignored in this stub, just here to match signature
// Fake "Supabase-style" user object
export async function signup({ fullName, email, password }) {
  const user = makeUser({ fullName, email });
  writeStoredUser(user);

  // Original Supabase version returns { user, session, ... }
  // We'll just return an object with user so the calling code has something.
  return { user };
}

// Match: export async function login({ email, password })
export async function login({ email, password }) {
  // In a real app you'd verify email/password.
  // Here we either reuse an existing user or create a new one on the fly.

  let user = readStoredUser();

  if (!user || user.email !== email) {
    // Create a generic dev user if none stored or email changed
    user = makeUser({ fullName: "Dev User", email });
  }

  writeStoredUser(user);

  return { user };
}

// Match: export async function getCurrentUser()
export async function getCurrentUser() {
  let user = readStoredUser();

  // DEV: always ensure we have a non-null user
  if (!user) {
    user = makeUser({
      fullName: "Dev User",
      email: "dev@example.com",
    });
    writeStoredUser(user);
  }

  // Return a Supabase-like user object
  return user;
}


// Match: export async function logout()
export async function logout() {
  writeStoredUser(null);
}

// Match: export async function updateCurrentUser({ password, fullName, avatar })
export async function updateCurrentUser({ password, fullName, avatar }) {
  let user = readStoredUser();

  if (!user) {
    // In the real app this would likely throw. We'll just bail.
    throw new Error("No current user to update");
  }

  // Update name if provided
  if (fullName) {
    user = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        fullName,
      },
    };
  }

  // Ignore password in this stub (we don't actually authenticate).

  // Avatar: we don't upload files here, but we can store a fake URL or data string
  if (avatar) {
    user = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        avatar:
          typeof avatar === "string"
            ? avatar
            : user.user_metadata.avatar,
      },
    };
  }

  writeStoredUser(user);

  // Original Supabase function returns updatedUser (a user object)
  return { user };
}
