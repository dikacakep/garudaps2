import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://garuda.gtpscache.site/api/leaderboard", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Leaderboard Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}