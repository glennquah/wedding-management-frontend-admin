"use client";

import { useSession } from "next-auth/react";;
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <p className="mb-2">Hello, <span className="font-semibold">{session.user?.name || session.user?.email}</span> 👋</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Dummy Stats</h2>
        <ul className="list-disc pl-6">
          <li>Events planned: 3</li>
          <li>Vendors contacted: 7</li>
          <li>Tasks completed: 12</li>
        </ul>
      </div>
    </main>
  );
}
