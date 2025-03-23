import { CORE_ID, DATABASE_ID, PAYMENT_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

export const POST = async (req: Request) => {
  const { databases } = await createSessionClient();
  const cookie = await cookies();
  const sessionId = cookie.get("UPAN_SESSION");

  if (!sessionId?.value) {
    return new Response("Data not found.", { status: 404 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("File not found.", { status: 404 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const file64 = buffer.toString("base64");

  const userDoc = await databases.listDocuments(DATABASE_ID, CORE_ID, [
    Query.equal("sessionId", sessionId.value),
  ]);

  if (userDoc.total === 0) {
    return new Response("Data not found.", { status: 404 });
  }

  if (userDoc.documents[0].paymentId) {
    await databases.updateDocument(
      DATABASE_ID,
      PAYMENT_ID,
      userDoc.documents[0].paymentId,
      {
        isPaid: "FALSE",
      }
    );
  }

  await databases.updateDocument(
    DATABASE_ID,
    CORE_ID,
    userDoc.documents[0].$id,
    {
      source: file64,
      response: null,
      paymentId: null,
    }
  );

  return Response.json({ status: true, message: "Source Uploaded" });
};
