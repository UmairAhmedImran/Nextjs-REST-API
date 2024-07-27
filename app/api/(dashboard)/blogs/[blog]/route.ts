import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/models/blog";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }),
        {
          status: 400,
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Category ID" }),
        {
          status: 400,
        }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Blog ID" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }
    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User ID" }),
        {
          status: 400,
        }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Blog ID" }),
        {
          status: 400,
        }
      );
    }

    await connect();
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({ message: "Blog updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error updating the blogs" + error.message, {
      status: 500,
    });
  }
};
