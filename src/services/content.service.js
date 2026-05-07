import api from "./api";

// ✅ Get teacher content
export const getMyContent = (teacherId) =>
  api.get(`/content?teacherId=${teacherId}`);

// ✅ Get all
export const getAllContent = () =>
  api.get("/content");

// ✅ Upload
export const uploadContent = (data) =>
  api.post("/content", data);

// ✅ Update
export const updateContentStatus = (
  id,
  data
) =>
  api.patch(`/content/${id}`, data);