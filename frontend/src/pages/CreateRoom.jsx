import { useState } from "react";
import { createRoom } from "../services/roomService";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [usePIN, setUsePIN] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await createRoom(name.trim(), usePIN ? pin.trim() : null);
      navigate(`/room/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="card form-card">
        <h1>Create a Room</h1>
        <p className="subtitle">
          Give your room a name and start editing together.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Room Name</label>
            <input
              className="input"
              placeholder="e.g. Sprint Planning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="pin-toggle-label">
              <input
                type="checkbox"
                checked={usePIN}
                onChange={(e) => setUsePIN(e.target.checked)}
              />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7, marginLeft: 6, marginRight: 4, verticalAlign: 'middle' }}>
                <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-3 6V5a3 3 0 116 0v2H5zm3 3a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 018 10z"/>
              </svg>
              Lock with PIN
            </label>
          </div>

          {usePIN && (
            <div className="form-group">
              <label>Room PIN</label>
              <input
                className="input"
                type="password"
                placeholder="Enter a PIN (e.g. 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={20}
              />
              <span className="input-hint">Others will need this PIN to enter the room.</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading || (usePIN && !pin.trim())}>
              {loading ? <span className="spinner" /> : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}