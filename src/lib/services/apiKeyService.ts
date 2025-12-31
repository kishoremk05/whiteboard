import { supabase } from "../supabase";

// Save user's Gemini API key to Supabase
export async function saveUserApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Try to update first, if no row exists, insert
        const { data: existing } = await supabase
            .from("user_settings")
            .select("id")
            .eq("user_id", user.id)
            .single();

        let error;
        if (existing) {
            // Update existing record
            const result = await supabase
                .from("user_settings")
                .update({ gemini_api_key: apiKey })
                .eq("user_id", user.id);
            error = result.error;
        } else {
            // Insert new record
            const result = await supabase
                .from("user_settings")
                .insert({ user_id: user.id, gemini_api_key: apiKey });
            error = result.error;
        }

        if (error) {
            console.error("[API Key] Save error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("[API Key] Save failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to save API key"
        };
    }
}

// Fetch user's Gemini API key from Supabase
export async function getUserApiKey(): Promise<string | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const { data, error } = await supabase
            .from("user_settings")
            .select("gemini_api_key")
            .eq("user_id", user.id)
            .single();

        if (error) {
            // If no record exists, that's okay
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error("[API Key] Fetch error:", error);
            return null;
        }

        return data?.gemini_api_key || null;
    } catch (error) {
        console.error("[API Key] Fetch failed:", error);
        return null;
    }
}

// Delete user's API key from Supabase
export async function deleteUserApiKey(): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        const { error } = await supabase
            .from("user_settings")
            .update({ gemini_api_key: null })
            .eq("user_id", user.id);

        if (error) {
            console.error("[API Key] Delete error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("[API Key] Delete failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete API key"
        };
    }
}
