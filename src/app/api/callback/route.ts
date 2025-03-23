import { DATABASE_ID, MIDTRANS_KEY, PAYMENT_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { createHash } from "crypto";

export const POST = async (req: NextRequest) => {
  try {
    // Parsing body URL-encoded
    const body = await req.json();

    const {
      transaction_status,
      order_id,
      signature_key,
      gross_amount,
      status_code,
      fraud_status,
    } = body;

    let orderStatus;

    if (transaction_status === "capture" && fraud_status === "accept") {
      orderStatus = "SUCCESS";
    } else if (transaction_status === "settlement") {
      orderStatus = "SUCCESS";
    } else if (transaction_status === "pending") {
      orderStatus = "WAIT";
    } else {
      orderStatus = "FALSE";
    }

    const signature = order_id + status_code + gross_amount + MIDTRANS_KEY;
    const hashedSignature = createHash("sha512")
      .update(signature)
      .digest("hex");
    const isValid = hashedSignature === signature_key;

    if (!isValid) {
      return new NextResponse("Data not valid", {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Appwrite Query
    const { databases } = await createSessionClient();
    const existingDoc = await databases.listDocuments(DATABASE_ID, PAYMENT_ID, [
      Query.equal("reference", order_id),
    ]);

    if (existingDoc.total === 0) {
      return new NextResponse("Data not found", {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    await databases.updateDocument(
      DATABASE_ID,
      PAYMENT_ID,
      existingDoc.documents[0].$id,
      {
        isPaid:
          orderStatus === "SUCCESS"
            ? "SUCCESS"
            : orderStatus === "WAIT"
            ? "WAIT"
            : "FALSE",
      }
    );

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("INTERNAL_ERROR:", error);
    return new NextResponse("Internal Error", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
};
