import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";

const bulkOperationSchema = z.object({
  noteIds: z.array(z.string()).min(1, "At least one note ID is required"),
  operation: z.enum([
    "archive",
    "unarchive",
    "delete",
    "updateWorkspace",
    "updateCategory",
  ]),
  data: z
    .object({
      workspace: z.string().optional(),
      category: z.string().optional(),
    })
    .optional(),
});

// POST /api/notes/bulk - Perform bulk operations on notes
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { noteIds, operation, data } = bulkOperationSchema.parse(body);

    // Verify all notes belong to the user
    const notes = await prisma.note.findMany({
      where: {
        id: { in: noteIds },
        userId: payload.userId,
      },
    });

    if (notes.length !== noteIds.length) {
      return NextResponse.json(
        { error: "Some notes not found or don't belong to user" },
        { status: 404 }
      );
    }

    let updateData: any = {};
    let message = "";

    switch (operation) {
      case "archive":
        updateData = { isArchived: true };
        message = `${noteIds.length} notes archived`;
        break;
      case "unarchive":
        updateData = { isArchived: false };
        message = `${noteIds.length} notes unarchived`;
        break;
      case "delete":
        await prisma.note.deleteMany({
          where: {
            id: { in: noteIds },
            userId: payload.userId,
          },
        });
        return NextResponse.json({
          message: `${noteIds.length} notes deleted`,
          deletedCount: noteIds.length,
        });
      case "updateWorkspace":
        if (!data?.workspace) {
          return NextResponse.json(
            { error: "Workspace is required for updateWorkspace operation" },
            { status: 400 }
          );
        }
        updateData = { workspace: data.workspace };
        message = `${noteIds.length} notes moved to workspace: ${data.workspace}`;
        break;
      case "updateCategory":
        if (!data?.category) {
          return NextResponse.json(
            { error: "Category is required for updateCategory operation" },
            { status: 400 }
          );
        }
        updateData = { category: data.category };
        message = `${noteIds.length} notes updated to category: ${data.category}`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }

    // Perform the bulk update
    const result = await prisma.note.updateMany({
      where: {
        id: { in: noteIds },
        userId: payload.userId,
      },
      data: updateData,
    });

    return NextResponse.json({
      message,
      updatedCount: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error performing bulk operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
