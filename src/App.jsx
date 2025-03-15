import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(` function average(x,y) {
  return x+y/2;
}`);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false); // 🔥 Loading state added

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true); // Show loading indicator
    try {
      const response = await axios.post("https://lms-server-4xuv.onrender.com/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      setReview("⚠️ Error fetching review. Please try again.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <button 
            onClick={reviewCode} 
            className="review"
            disabled={loading} // Disable button when loading
            style={{ opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Reviewing..." : "Review"}
          </button>
        </div>
        <div className="right">
          {loading ? (
            <p>⏳ Generating review...</p> // 🔥 Show loading text
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
