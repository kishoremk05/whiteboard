const API_KEY_STORAGE_KEY = "canvasai_gemini_api_key";

export async function saveUserApiKey(
  apiKey: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save API key",
    };
  }
}

export async function getUserApiKey(): Promise<string | null> {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function deleteUserApiKey(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete API key",
    };
  }
}
