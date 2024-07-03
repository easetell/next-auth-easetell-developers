import { NextResponse, NextRequest } from 'next/server';
import { hash } from "bcryptjs";
import clientPromise from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });
    console.log("Existing user:", existingUser);
    // Check if User already exists
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = {
      email,
      password: hashedPassword,
    };

    await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}
