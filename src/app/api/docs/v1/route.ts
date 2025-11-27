import { NextResponse } from "next/server";
import { MormDocs } from "../../mormDocs";
const mormDocs = new MormDocs();

export async function GET(req: Request) {
  try {
    // fetch docs
    const data = await mormDocs.getDocs();

    return NextResponse.json({
      success: true,
      message: "Fetched successfully",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();
    const data = await mormDocs.insertDoc(title, content);

    return NextResponse.json({
      success: true,
      message: "Created successfully",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
