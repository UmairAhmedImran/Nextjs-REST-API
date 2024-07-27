import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const user = await User.find();
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in Fetching Users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
  } catch (error) {}
};
