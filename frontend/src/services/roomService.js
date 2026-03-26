import api from "./api";

export const createRoom = (name, pin) => {
  let url = `/rooms/create?name=${encodeURIComponent(name)}`;
  if (pin) url += `&pin=${encodeURIComponent(pin)}`;
  return api.post(url);
};

export const joinRoom = (roomId) =>
  api.get(`/rooms/${roomId}`);

export const verifyRoomPin = (roomId, pin) =>
  api.post(`/rooms/${roomId}/verify-pin`, { pin });

export const getAllRooms = () =>
  api.get("/rooms");