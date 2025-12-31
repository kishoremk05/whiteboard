import { useState, useEffect } from "react";
import { Settings, X, Key, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { saveUserApiKey, getUserApiKey, deleteUserApiKey } from "../../lib/services/apiKeyService";

interface AISettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISettingsModal({ open, onOpenChange }: AISettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load API key from Supabase when modal opens
  useEffect(() => {
    if (open) {
      loadApiKey();
    }
  }, [open]);

  const loadApiKey = async () => {
    setFetching(true);
    const key = await getUserApiKey();
    if (key) {
      setApiKey(key);
    }
    setFetching(false);
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    if (apiKey.trim().length < 20) {
      toast.error("API key seems too short");
      return;
    }

    setLoading(true);
    const result = await saveUserApiKey(apiKey.trim());
    setLoading(false);

    if (result.success) {
      toast.success("API key saved successfully!");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to save API key");
    }
  };

  const handleClear = async () => {
    setLoading(true);
    const result = await deleteUserApiKey();
    setLoading(false);

    if (result.success) {
      setApiKey("");
      toast.info("API key cleared. Using default key.");
    } else {
      toast.error(result.error || "Failed to clear API key");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">AI Settings</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            </div>
          ) : (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Key className="w-4 h-4" />
                  Gemini API Key
                </label>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-sm"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Get your free API key from{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Your API key is securely stored in your
                  account and used only for your AI requests.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading || !apiKey.trim()}
                  className="flex-1 bg-violet-500 hover:bg-violet-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save API Key"
                  )}
                </Button>
                {apiKey && (
                  <Button
                    onClick={handleClear}
                    disabled={loading}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
