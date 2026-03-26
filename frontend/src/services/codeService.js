import api from "./api";

export const saveCode = (roomId, code, editedBy) =>
  api.post("/code/save", { roomId, code, editedBy });

export default { saveCode };
