"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[400px] mt-18">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-[#2D2D2D] text-4xl font-bold">Login</h1>
        <p className="text-[#6B6B6B] text-sm">
          You will receive a one time password
        </p>
      </div>

      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md bg-white border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md bg-white border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FF33A0] text-white py-3 rounded-md hover:bg-[#FF33A0]/80 transition-colors mt-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Submit"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link 
          href="/auth/signup" 
          className="text-black font-semibold hover:underline"
        >
          Create one
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}