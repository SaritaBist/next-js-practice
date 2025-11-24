"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface SignInFormInputs {
  email: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();
  const router = useRouter();
  const onSubmit = async (data: SignInFormInputs) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.ok) {
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } else {
      toast.error(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <button
          type="button"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition flex items-center justify-center mb-6"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          {/* ...icon... */}
          Sign in with Google
        </button>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
        >
          Sign In
        </button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">New here?</span>
          <Link href="/signup" className="text-blue-600 hover:underline ml-1">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
