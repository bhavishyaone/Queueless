import api from "./axios";

export const fetchLiveQueue = async () => {
  const res = await api.get("/queue/live");
  return res.data;
};

export const createToken = async () => {
  const res = await api.post("/queue");
  return res.data;
};

export const serveNext = async (counterId) => {
  const res = await api.post("/queue/serve", { counterId });
  return res.data;
};

export const completeToken = async (tokenId) => {
  const res = await api.patch(`/queue/${tokenId}/complete`);
  return res.data;
};

export const skipToken = async (tokenId) => {
  const res = await api.patch(`/queue/${tokenId}/skip`);
  return res.data;
};
