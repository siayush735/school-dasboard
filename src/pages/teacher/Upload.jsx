import { useForm } from "react-hook-form";
import { useState } from "react";
import { uploadContent } from "../../services/content.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Upload() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

 const onSubmit = async (data) => {
  if (!user) return toast.error("User not logged in");

  const file = data.file?.[0];

  if (!file) return toast.error("File required");

  if (!file.type.match("image/(jpeg|png|gif)"))
    return toast.error("Only JPG, PNG, GIF allowed");

  if (file.size > 10 * 1024 * 1024)
    return toast.error("Max size 10MB");

  // ✅ Fixed Date Validation
  const start = new Date(data.startTime).getTime();
  const end = new Date(data.endTime).getTime();

  if (isNaN(start) || isNaN(end)) {
    return toast.error("Invalid date/time");
  }

  if (end <= start) {
    return toast.error("End time must be greater than start time");
  }

  const payload = {
    teacherId: Number(user.id),
    title: data.title,
    subject: data.subject,
    description: data.description || "",
    fileUrl: preview,
    status: "pending",
    startTime: data.startTime,
    endTime: data.endTime,
    rotationDuration:
      Number(data.rotationDuration) || 5,
    rejectionReason: "",
  };

  try {
    setLoading(true);

    await uploadContent(payload);

    toast.error("Uploaded successfully");

    reset();
    setPreview(null);

  } catch {
    toast.error("Upload failed");
  } finally {
    setLoading(false);
  }
};
const handleFileChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setPreview(reader.result);
  };

  reader.readAsDataURL(file);
};
 
  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold mb-5 text-center">
        Upload Content
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Title *
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Subject *
          </label>
          <input
            {...register("subject", { required: "Subject is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full border p-2 h-24 rounded"
          />
        </div>

        {/* File */}
        <div>
  <label className="block text-sm font-semibold mb-2">
    Upload File *
  </label>

  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition cursor-pointer bg-gray-50">
    
 <input
  type="file"
  id="fileUpload"
  className="hidden"
  accept="image/png,image/jpeg,image/gif"
  {...register("file", {
    required: "File is required",
    onChange:handleFileChange,
  })}
/>
    <label
      htmlFor="fileUpload"
      className="flex flex-col items-center justify-center cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-blue-500 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <p className="text-sm text-gray-600">
        Click to upload or drag & drop
      </p>

      <p className="text-xs text-gray-400 mt-1">
        JPG, PNG, GIF (Max 10MB)
      </p>
    </label>
  </div>

  {errors.file && (
    <p className="text-red-500 text-sm mt-2">
      {errors.file.message}
    </p>
  )}
</div>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-cover rounded mx-auto"
          />
        )}

        {/* Start Time */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Start Time *
          </label>
          <input
            type="datetime-local"
            step="60"
            {...register("startTime", {
              required: "Start time is required",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm">
              {errors.startTime.message}
            </p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            End Time *
          </label>
          <input
            type="datetime-local"
            step="60"
            {...register("endTime", {
              required: "End time is required",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm">
              {errors.endTime.message}
            </p>
          )}
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Rotation Duration (seconds)
          </label>
          <input
            type="number"
            {...register("rotationDuration")}
            className="w-full border p-1 rounded"
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}