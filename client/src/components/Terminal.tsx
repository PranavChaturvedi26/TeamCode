import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  output: string;
}

const Terminal: React.FC<TerminalProps> = ({ output }) => {
  const [localOutput, setLocalOutput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalOutput(output);
  }, [output]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [localOutput]);

  const formatOutput = (text: string) => {
    return text.split("\n").map((line, index) => (
      <div key={index} className="leading-6">
        {line || "\u00A0"}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">Terminal</span>
          <span className="text-xs text-gray-500">Output</span>
        </div>
        <button
          onClick={() => setLocalOutput("")}
          className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm text-gray-300 whitespace-pre-wrap"
      >
        {localOutput ? (
          formatOutput(localOutput)
        ) : (
          <div className="text-gray-500 italic">
            Click "Run Code" to see output here...
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
