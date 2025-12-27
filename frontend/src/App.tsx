import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    setIsLoading(true);

    // Mock API call - replace this with your actual AWS Lambda endpoint
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - replace with actual fetch call
      const mockResponse = {
        status: 'success',
        message: 'Text received successfully',
        receivedText: inputText,
        timestamp: new Date().toISOString(),
        processedLength: inputText.length,
      };

      setOutputText(JSON.stringify(mockResponse, null, 2));
      
      /* 
      // Example of actual API call to AWS Lambda:
      const response = await fetch('YOUR_API_GATEWAY_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      
      const data = await response.json();
      setOutputText(JSON.stringify(data, null, 2));
      */
      
    } catch (error) {
      setOutputText(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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
