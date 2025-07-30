import { useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import socket from "../lib/socket";

interface EditorProps {
  projectId: string;
  setOutput: (output: string) => void;
}

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "typescript", name: "TypeScript", icon: "TS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "java", name: "Java", icon: "JA" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "c", name: "C", icon: "C" },
  { id: "html", name: "HTML", icon: "HTML" },
  { id: "css", name: "CSS", icon: "CSS" },
  { id: "json", name: "JSON", icon: "JSON" },
  { id: "rust", name: "Rust", icon: "RS" },
  { id: "go", name: "Go", icon: "GO" },
  { id: "php", name: "PHP", icon: "PHP" },
  { id: "ruby", name: "Ruby", icon: "RB" },
  { id: "swift", name: "Swift", icon: "SW" },
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Welcome to the Code Editor\nconsole.log("Hello, World!");`,
  typescript: `// TypeScript Example\nconst message: string = "Hello, TypeScript!";\nconsole.log(message);`,
  python: `# Python Example\nprint("Hello, World!")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>`,
  css: `/* CSS Example */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n}`,
  json: `{\n  "message": "Hello, World!",\n  "language": "JSON"\n}`,
  rust: `fn main() {\n    println!("Hello, World!");\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  php: `<?php\necho "Hello, World!";\n?>`,
  ruby: `# Ruby Example\nputs "Hello, World!"`,
  swift: `// Swift Example\nprint("Hello, World!")`,
};

const Editor: React.FC<EditorProps> = ({ projectId, setOutput }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage] || "");
  };

  const runCode = async () => {
    if (!code.trim()) {
      setOutput("No code to run");
      return;
    }

    setIsRunning(true);
    setOutput("Running code...\n");

    try {
      socket.emit("run-code", {
        projectId,
        language,
        code,
      });

      socket.once("code-output", (result: { output?: string; error?: string }) => {
        if (result.error) {
          setOutput(`Error: ${result.error}`);
        } else {
          setOutput(result.output || "No output");
        }
        setIsRunning(false);
      });

      socket.once("code-error", (error: string) => {
        setOutput(`Execution Error: ${error}`);
        setIsRunning(false);
      });

      setTimeout(() => {
        if (isRunning) {
          setOutput("Code execution timed out");
          setIsRunning(false);
        }
      }, 30000);
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-500 hover:bg-gray-600 transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-md font-medium transition-all ${
              isRunning
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
            }`}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Running...
              </span>
            ) : (
              "Run Code"
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 sm:p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm sm:text-base"
            title="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
