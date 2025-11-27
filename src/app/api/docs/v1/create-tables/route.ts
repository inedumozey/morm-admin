import { NextResponse } from "next/server";
import { MormDocs } from "@/app/api/mormDocs";
const mormDocs = new MormDocs();

export async function GET(req: Request) {
  try {
    // fetch docs
    await mormDocs.createDocsTable();

    return NextResponse.json({
      success: true,
      message: "Table created successfully",
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
