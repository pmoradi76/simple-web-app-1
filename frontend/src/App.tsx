import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // IMPORTANT:
  // If your API route is POST /process, include it here.
  // Example full URL:
  // https://9z5r8j9h2d.execute-api.ap-southeast-2.amazonaws.com/process
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://9z5r8j9h2d.execute-api.ap-southeast-2.amazonaws.com/submit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      // Try to parse JSON (even on errors, API Gateway might return JSON)
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        // Show useful debug info in the output box
        setOutputText(
          JSON.stringify(
            {
              ok: false,
              status: response.status,
              statusText: response.statusText,
              data,
            },
            null,
            2
          )
        );
        return;
      }

      setOutputText(JSON.stringify(data, null, 2));
    } catch (error) {
      setOutputText(
        `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Simple Text Submission</h1>
            <p className="text-gray-600">
              Send text to the server and view the response below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input Section */}
            <div>
              <label htmlFor="input-text" className="block mb-2 text-gray-700">
                Input
              </label>
              <input
                id="input-text"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your text here…"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="mt-3 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div>
              <label htmlFor="output-text" className="block mb-2 text-gray-700">
                Output
              </label>
              <textarea
                id="output-text"
                value={outputText}
                readOnly
                placeholder="Server response will appear here…"
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none focus:outline-none overflow-auto"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
