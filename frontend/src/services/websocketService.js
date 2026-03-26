import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_URL } from "../utils/constants";

let stompClient = null;
let subscriptions = {};

export const connectWebSocket = (roomId, onCodeMessage, onConnect, onPresenceMessage, onLanguageMessage) => {
  const socket = new SockJS(WS_URL);
  stompClient = Stomp.over(socket);

  // Disable debug logging in production
  stompClient.debug = null;

  stompClient.connect({}, () => {
    // Subscribe to code updates
    subscriptions.code = stompClient.subscribe(`/topic/code/${roomId}`, (msg) => {
      try {
        const parsed = JSON.parse(msg.body);
        onCodeMessage(parsed);
      } catch (e) {
        onCodeMessage(msg.body);
      }
    });

    // Subscribe to presence updates
    if (onPresenceMessage) {
      subscriptions.presence = stompClient.subscribe(`/topic/presence/${roomId}`, (msg) => {
        try {
          const parsed = JSON.parse(msg.body);
          onPresenceMessage(parsed);
        } catch (e) {}
      });
    }

    // Subscribe to language updates
    if (onLanguageMessage) {
      subscriptions.language = stompClient.subscribe(`/topic/language/${roomId}`, (msg) => {
        try {
          const parsed = JSON.parse(msg.body);
          onLanguageMessage(parsed);
        } catch (e) {}
      });
    }

    if (onConnect) onConnect();
  }, (error) => {
    console.error("WebSocket connection error:", error);
  });
};

export const sendCodeMessage = (roomId, message) => {
  try {
    if (stompClient && stompClient.connected) {
      const payload = typeof message === "string" ? message : JSON.stringify(message);
      stompClient.send(`/app/code.update/${roomId}`, {}, payload);
    }
  } catch (e) {
    console.warn("Failed to send websocket message", e);
  }
};

// Keep backward compat
export const sendMessage = sendCodeMessage;

export const sendJoinMessage = (roomId, username) => {
  try {
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/room.join/${roomId}`, {}, JSON.stringify({ username }));
    }
  } catch (e) {
    console.warn("Failed to send join message", e);
  }
};

export const sendLanguageMessage = (roomId, language, changedBy) => {
  try {
    if (stompClient && stompClient.connected) {
      stompClient.send(`/app/language.update/${roomId}`, {}, JSON.stringify({ language, changedBy }));
    }
  } catch (e) {
    console.warn("Failed to send language message", e);
  }
};

export const disconnectWebSocket = () => {
  try {
    Object.values(subscriptions).forEach(sub => {
      if (sub && typeof sub.unsubscribe === "function") {
        sub.unsubscribe();
      }
    });
    subscriptions = {};
  } catch (e) {
    console.warn("Error while unsubscribing websocket subscriptions:", e);
    subscriptions = {};
  }

  try {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
    }
  } catch (e) {
    console.warn("Error while disconnecting websocket client:", e);
  } finally {
    stompClient = null;
  }
};