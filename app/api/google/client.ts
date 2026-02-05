import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

function normalizePrivateKey(raw: string | undefined): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;

  let key = raw;

  // Remove surrounding quotes that might be in the env var
  key = key.replace(/^["']|["']$/g, "");

  // Replace escaped newlines with actual newlines (common in .env files)
  key = key.replace(/\\n/g, "\n");

  // Normalize line endings (Windows \r\n or lone \r can break OpenSSL)
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Trim whitespace
  key = key.trim();

  return key || undefined;
}

function validatePrivateKey(key: string | undefined): string {
  if (!key) {
    throw new Error("GOOGLE_PRIVATE_KEY environment variable is not set");
  }

  if (!key.includes("BEGIN")) {
    throw new Error("Invalid private key format: missing BEGIN header");
  }

  if (!key.includes("END")) {
    throw new Error("Invalid private key format: missing END footer");
  }

  return key;
}

const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

export function getCalendarClient() {
  if (!clientEmail) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is not set");
  }

  const validatedKey = validatePrivateKey(privateKey);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: validatedKey,
    },
    scopes: SCOPES,
  });

  return google.calendar({ version: "v3", auth });
}

// Export auth for backward compatibility
export const auth = clientEmail && privateKey
  ? new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: SCOPES,
    })
  : new google.auth.GoogleAuth({ scopes: SCOPES });
