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
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating User" + error.message, {
      status: 500,
    });
  }
};
