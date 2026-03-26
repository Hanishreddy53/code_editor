import { useEffect, useState, useCallback, useRef } from "react";
import {
  connectWebSocket,
  sendCodeMessage,
  sendJoinMessage,
  sendLanguageMessage,
  disconnectWebSocket,
} from "../services/websocketService";
import { getToken } from "../utils/tokenStorage";

function getUsernameFromToken() {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.sub || json.username || null;
  } catch (e) {
    return null;
  }
}

export default function useWebSocket(roomId, onCodeMessage, onPresenceMessage, onLanguageMessage) {
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const roomIdRef = useRef(roomId);
  roomIdRef.current = roomId;

  useEffect(() => {
    if (!roomId) return;

    const handlePresence = (msg) => {
      if (msg && msg.users) {
        setUsers(msg.users);
      }
      if (onPresenceMessage) onPresenceMessage(msg);
    };

    const handleLanguage = (msg) => {
      if (onLanguageMessage) onLanguageMessage(msg);
    };

    connectWebSocket(
      roomId,
      (msg) => onCodeMessage(msg),
      () => {
        setConnected(true);
        // Send join message after connecting
        const username = getUsernameFromToken();
        if (username) {
          sendJoinMessage(roomId, username);
        }
      },
      handlePresence,
      handleLanguage
    );

    return () => {
      disconnectWebSocket();
      setConnected(false);
      setUsers([]);
    };
  }, [roomId]);

  const sendCode = useCallback(
    (message) => {
      sendCodeMessage(roomIdRef.current, message);
    },
    []
  );

  const sendLanguage = useCallback(
    (language) => {
      const username = getUsernameFromToken();
      sendLanguageMessage(roomIdRef.current, language, username);
    },
    []
  );

  return { sendCode, sendLanguage, connected, users };
}