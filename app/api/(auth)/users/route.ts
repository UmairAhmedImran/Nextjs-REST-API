import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

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

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json(); // data from body request
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new usernname not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }
    const updatedUesr = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUesr) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updatedUesr }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating User" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // get user from search params
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), {
        status: 400,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }
    await connect();
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );
    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "User is deleted", user: deletedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting User" + error.message, {
      status: 500,
    });
  }
};
