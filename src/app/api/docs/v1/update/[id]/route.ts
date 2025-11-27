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

    let res = await mormDocs.getDoc(id);
    if (res) {
      const data = await mormDocs.updateDoc(id, { title, content });
      return NextResponse.json({
        success: true,
        message: "Updated successfully",
        data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Documentation not found",
        },
        { status: 404 }
      );
    }
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
