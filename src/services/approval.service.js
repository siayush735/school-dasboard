import api from "./api";

export const approveContent = (id) =>
  api.patch(`/content/${id}`, {
    status: "approved",
    rejectionReason: "",
  });

export const rejectContent = (id, reason) =>
  api.patch(`/content/${id}`, {
    status: "rejected",
    rejectionReason: reason,
  });