import { useState, useRef, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import useWebSocket from "../hooks/useWebSocket";
import { getToken } from "../utils/tokenStorage";
import { saveCode } from "../services/codeService";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "html",
  "css",
  "json",
  "markdown",
  "sql",
  "go",
  "rust",
  "php",
];

export default function Editor({ roomId, showUsers }) {
  const [code, setCode] = useState("// Start coding here...\n");
  const [language, setLanguage] = useState("javascript");
  const [lastEditor, setLastEditor] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"
  const isRemoteUpdate = useRef(false);
  const isRemoteLanguage = useRef(false);
  const saveTimer = useRef(null);
  const saveStatusTimer = useRef(null);

  const getUsernameFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const payload = token.split(".")[1];
      const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      return json.sub || json.username || null;
    } catch (e) {
      return null;
    }
  };

  const LANG_EXTENSIONS = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp",
    csharp: "cs",
    html: "html",
    css: "css",
    json: "json",
    markdown: "md",
    sql: "sql",
    go: "go",
    rust: "rs",
    php: "php",
  };

  const handleSave = useCallback(() => {
    setSaveStatus("saving");
    try {
      const ext = LANG_EXTENSIONS[language] || "txt";
      const filename = `code-room-${roomId}.${ext}`;
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSaveStatus("saved");
      if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
      saveStatusTimer.current = setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      setSaveStatus("error");
      if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
      saveStatusTimer.current = setTimeout(() => setSaveStatus(null), 3000);
    }
  }, [roomId, code, language]);

  const handleLanguageFromRemote = useCallback((msg) => {
    if (msg && msg.language) {
      const myUsername = getUsernameFromToken();
      // Only apply if it's from someone else
      if (msg.changedBy !== myUsername) {
        isRemoteLanguage.current = true;
        setLanguage(msg.language);
      }
    }
  }, []);

  const { sendCode, sendLanguage, connected, users } = useWebSocket(
    roomId,
    (message) => {
      isRemoteUpdate.current = true;
      if (message && typeof message === "object") {
        setCode(message.code || "");
        setLastEditor(message.editedBy || null);
      } else {
        setCode(message || "");
      }
    },
    null, // presence handled in hook
    handleLanguageFromRemote
  );

  const handleEditorChange = useCallback(
    (value) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }

      setCode(value || "");

      const username = getUsernameFromToken();
      const payload = { roomId, code: value || "", editedBy: username };
      sendCode(payload);

      // debounce save to API
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        try {
          saveCode(roomId, value || "", username).catch(() => {});
        } catch (e) {}
      }, 1000);
    },
    [sendCode]
  );

  const handleLanguageChange = useCallback(
    (e) => {
      const newLang = e.target.value;
      setLanguage(newLang);
      // Broadcast language change to all users
      sendLanguage(newLang);
    },
    [sendLanguage]
  );

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <div className="file-tab">
          <span className="dot" style={{ background: connected ? '#3fb950' : '#f85149' }} />
          <span>{connected ? "Connected" : "Connecting..."}</span>
          <span style={{ marginLeft: 12, color: '#9aa4b2' }}>
            Last edit: {lastEditor || '—'}
          </span>
        </div>
        <div className="toolbar-right">
          <button
            className={`btn btn-sm save-btn ${saveStatus === 'saved' ? 'save-btn-saved' : saveStatus === 'error' ? 'save-btn-error' : 'btn-primary'}`}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            title="Save code (Ctrl+S)"
          >
            {saveStatus === "saving" ? (
              <>
                <span className="spinner-tiny" />
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                Saved!
              </>
            ) : saveStatus === "error" ? (
              <>Error</>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.463 11.098a.25.25 0 00-.064.108l-.631 2.208 2.208-.63a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.354l-1.086-1.086z"/></svg>
                Save
              </>
            )}
          </button>
          <select
            className="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="editor-main">
        {showUsers && (
          <div className="users-panel">
            <div className="users-panel-header">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{opacity: 0.7}}>
                <path d="M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm5 6a2 2 0 100-4 2 2 0 000 4zm0-3a1 1 0 110 2 1 1 0 010-2z"/>
              </svg>
              Online — {users.length}
            </div>
            <ul className="users-list">
              {users.map((user) => (
                <li key={user} className="users-list-item">
                  <span className="user-avatar">{user.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user}</span>
                  <span className="user-status-dot" />
                </li>
              ))}
              {users.length === 0 && (
                <li className="users-list-empty">No users connected</li>
              )}
            </ul>
          </div>
        )}

        <div className="editor-wrapper">
          <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              minimap: { enabled: true },
              lineNumbers: "on",
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              renderLineHighlight: "all",
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>
      </div>

      <div className="status-bar">
        <div className="status-left">
          <span>Room: {roomId}</span>
          <span>{users.length} user{users.length !== 1 ? 's' : ''} online</span>
        </div>
        <div className="status-right">
          <span>{language}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}