import { useForm } from "react-hook-form";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);

      login(res);

      if (res.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/principal/dashboard");
      }
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center bg-gray-100 justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-2xl w-80"
      >
        <h2 className="text-xl text-center mb-4">Login</h2>

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full mb-3 p-2 border"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border"
        />

        <button className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-full p-2">
          Login
        </button>
      </form>
    </div>
  );
}