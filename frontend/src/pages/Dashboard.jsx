import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAllRooms } from "../services/roomService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRooms()
      .then((res) => setRooms(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Your Rooms</h1>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => navigate("/create")}>
            + New Room
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/join")}>
            Join Room
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-center mt-4">
          <span className="spinner" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <h3>No rooms yet</h3>
          <p>Create a new room or join an existing one to start coding together.</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="room-card"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <div className="room-card-top">
                <span className="room-name">{room.name || "Untitled Room"}</span>
                <span className={`room-lock-icon ${room.locked ? 'locked' : 'unlocked'}`} title={room.locked ? 'PIN Protected' : 'Open'}>
                  {room.locked ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-3 6V5a3 3 0 116 0v2H5zm3 3a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 018 10z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H8V5a3 3 0 116 0v1h1V5a4 4 0 00-4-4zM8 10a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 018 10z"/>
                    </svg>
                  )}
                </span>
              </div>
              <span className="room-code">#{room.roomCode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}