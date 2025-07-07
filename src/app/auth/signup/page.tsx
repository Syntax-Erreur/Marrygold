"use client"; // Client-side rendering for auth

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setupDefaultEventsForUser } from "@/lib/default-events";
import { toast } from "sonner";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name || user.email?.split("@")[0] || "",
        createdAt: new Date().toISOString(),
      });

      await setupDefaultEventsForUser(user.uid);
      
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[400px] " >
      <div className="flex flex-col gap-2 mb-6 mt-14">
        <h1 className="text-[#2D2D2D] text-4xl font-bold">Create Account</h1>
        <p className="text-[#6B6B6B] text-sm">
          You will receive a one time password
        </p>
      </div>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name (optional)"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-md bg-white border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
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
          {isSubmitting ? "Creating account..." : "Submit"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link 
          href="/auth/signin" 
          className="text-black font-semibold hover:underline"
        >
          Login
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}