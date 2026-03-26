import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ room, showUsers, onToggleUsers }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef(null);

  const roomLink = room ? `${window.location.origin}/room/${room.id}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = roomLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowLink(false);
      }
    };
    if (showLink) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLink]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">&lt;/&gt;</span>
        <span>CodeCollab</span>
      </div>

      <div className="navbar-info">
        {room && (
          <>
            <span>{room.name || "Untitled Room"}</span>
            <span className="room-badge">#{room.roomCode}</span>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {room && (
          <div className="share-link-wrapper" ref={popoverRef}>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => { setShowLink((v) => !v); setCopied(false); }}
              title="Share room link"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: 4}}>
                <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1 1 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 007.414 9.5l.586-.586a1 1 0 00.154-.199 2 2 0 01-.861-3.337L9.12 3.55a2 2 0 112.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 10-4.243-4.243L6.586 4.672z"/>
              </svg>
              Room Link
            </button>
            {showLink && (
              <div className="share-popover">
                <div className="share-popover-label">Share this link to invite others:</div>
                <div className="share-popover-input-row">
                  <input
                    className="share-popover-input"
                    value={roomLink}
                    readOnly
                    onFocus={(e) => e.target.select()}
                  />
                  <button className="btn btn-sm btn-primary share-copy-btn" onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {onToggleUsers && (
          <button
            className={`btn btn-sm ${showUsers ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onToggleUsers}
            title="Show online users"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: 4}}>
              <path d="M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0-4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm5 6a2 2 0 100-4 2 2 0 000 4zm0-3a1 1 0 110 2 1 1 0 010-2zM2 12c0-1.1.9-2 2-2h3a2 2 0 012 2v1H2v-1zm1 0v0h4v0a1 1 0 00-1-1H4a1 1 0 00-1 1zm7-1h2.5a1.5 1.5 0 011.5 1.5V13h-5v-1h3.5v-.5a.5.5 0 00-.5-.5H10v-1z"/>
            </svg>
            Users
          </button>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}