import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nLevel, rounds, score, matches } = body;

    if (!rounds || rounds < 5) {
      return NextResponse.json(
        { message: "Session too short" },
        { status: 400 }
      );
    }

    const totalTargets = matches.pos + matches.audio;
    const maxPossibleScore = totalTargets * 100;

    let accuracy = 0;
    if (totalTargets > 0) {
      const safeScore = score < 0 ? 0 : score;
      accuracy = Math.round((safeScore / maxPossibleScore) * 100);
    } else if (rounds > 0) {
      accuracy = 100;
    }

    let user = await prisma.user.findFirst();

    if (!user) {
      console.log("No users found. Creating Demo User...");
      user = await prisma.user.create({
        data: {
          email: "demo@example.com",
          password: "hashed_password_placeholder",
          nLevel: nLevel,
        },
      });
    }

    const savedSession = await prisma.gameSession.create({
      data: {
        userId: user.id,
        nLevel,
        rounds,
        score,
        accuracy,
        matchesPos: matches.pos,
        matchesAudio: matches.matchesAudio || matches.audio,
      },
    });

    if (nLevel > user.nLevel) {
      await prisma.user.update({
        where: { id: user.id },
        data: { nLevel: nLevel },
      });
    }

    return NextResponse.json(savedSession);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}
