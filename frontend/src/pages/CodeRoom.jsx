import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinRoom, verifyRoomPin } from "../services/roomService";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";

export default function CodeRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [needPin, setNeedPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    joinRoom(roomId)
      .then((res) => {
        setRoom(res.data);
        if (res.data.locked) {
          setNeedPin(true);
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        navigate("/dashboard");
      })
      .finally(() => setLoadingRoom(false));
  }, [roomId]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setPinError("");
    setPinLoading(true);
    try {
      const res = await verifyRoomPin(roomId, pin.trim());
      if (res.data.valid) {
        setAuthorized(true);
        setNeedPin(false);
      } else {
        setPinError("Invalid PIN. Please try again.");
      }
    } catch {
      setPinError("Invalid PIN. Please try again.");
    } finally {
      setPinLoading(false);
    }
  };

  if (loadingRoom) {
    return (
      <div className="flex-center" style={{ height: "100vh" }}>
        <span className="spinner" />
      </div>
    );
  }

  if (needPin && !authorized) {
    return (
      <div className="form-page">
        <div className="card form-card pin-gate-card">
          <div className="pin-gate-icon">
            <svg width="48" height="48" viewBox="0 0 16 16" fill="var(--accent)">
              <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-3 6V5a3 3 0 116 0v2H5zm3 3a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 018 10z"/>
            </svg>
          </div>
          <h1>Room Locked</h1>
          <p className="subtitle">
            This room is protected. Enter the PIN to continue.
          </p>
          {room && <p className="pin-gate-room-name">{room.name || "Untitled Room"}</p>}

          {pinError && <div className="error-msg">{pinError}</div>}

          <form onSubmit={handlePinSubmit}>
            <div className="form-group">
              <label>Room PIN</label>
              <input
                className="input pin-input"
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                maxLength={20}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Go Back
              </button>
              <button className="btn btn-primary" disabled={pinLoading || !pin.trim()}>
                {pinLoading ? <span className="spinner" /> : "Unlock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="coderoom-layout">
      <Navbar room={room} showUsers={showUsers} onToggleUsers={() => setShowUsers((v) => !v)} />
      <div className="coderoom-body">
        <Editor roomId={roomId} showUsers={showUsers} />
      </div>
    </div>
  );
}