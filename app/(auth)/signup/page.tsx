"use client";
import { trpc } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

interface SignUpFormInputs {
  email: string;
  password: string;
  name: string;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const router = useRouter();
  const mutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      toast.success(data?.message || "Signed up successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: SignUpFormInputs) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex  justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <button
          type="button"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition flex items-center justify-center mb-6"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          {/* ...icon... */}
          Sign Up with Google
        </button>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition flex items-center justify-center"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
          </span>
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
        {mutation.isError && (
          <div className="text-red-500 mt-2 text-center">
            {mutation.error?.message}
          </div>
        )}
      </form>
    </div>
  );
}
