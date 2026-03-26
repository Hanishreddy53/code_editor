import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../services/roomService";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    setError("");
    setLoading(true);
    try {
      await joinRoom(roomId.trim());
      navigate(`/room/${roomId.trim()}`);
    } catch (err) {
      setError(err.response?.data || "Room not found. Check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="card form-card">
        <h1>Join a Room</h1>
        <p className="subtitle">
          Enter the room ID to join an existing session.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleJoin}>
          <div className="form-group">
            <label>Room ID</label>
            <input
              className="input"
              placeholder="e.g. 1"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : "Join Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}