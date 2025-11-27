import { NextResponse } from "next/server";
import { MormDocs } from "../../../../mormDocs";
const mormDocs = new MormDocs();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { title, content } = await req.json();

    await mormDocs.updateDoc(id, { title, content });
    return NextResponse.json({
      success: true,
      message: "Updated successfully",
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
