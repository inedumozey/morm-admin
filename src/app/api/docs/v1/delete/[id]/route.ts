import { NextResponse } from "next/server";
import { MormDocs } from "../../../../mormDocs";
const mormDocs = new MormDocs();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await mormDocs.deleteDoc(id);
    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let res = await mormDocs.getDoc(id);
    if (res) {
      if (res.is_deleted) {
        // unhide it
        res = await mormDocs.softDeleteDoc(id, false);
      } else {
        // hide it
        res = await mormDocs.softDeleteDoc(id, true);
      }
      return NextResponse.json({
        success: true,
        message: "successfully",
        data: res,
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
