import {
  baseUrl,
  CORE_ID,
  DATABASE_ID,
  MIDTRANS_KEY,
  MIDTRANS_URL,
  PAYMENT_ID,
} from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { generateToken } from "@/lib/utils";

export const POST = async () =>
  // req: Request
  {
    try {
      const { databases } = await createSessionClient();

      const cookie = await cookies();
      const sessionId = cookie.get("MBTI_SESSION")?.value;

      if (!sessionId) {
        return new Response("Data not found.", { status: 404 });
      }

      const existingDoc = await databases.listDocuments(DATABASE_ID, CORE_ID, [
        Query.equal("sessionId", sessionId),
      ]);

      if (existingDoc.total === 0) {
        return new Response("Data not found.", { status: 404 });
      }

      const midtransAuth = Buffer.from(MIDTRANS_KEY).toString("base64");

      let orderId;
      let isUnique = false;

      while (!isUnique) {
        orderId = generateToken(30);

        // Cek apakah token sudah ada di database
        const existingSessions = await databases.listDocuments(
          DATABASE_ID,
          PAYMENT_ID,
          [Query.equal("reference", orderId)]
        );

        if (existingSessions.documents.length === 0) {
          isUnique = true;
        }
      }

      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: 9005,
        },
        credit_card: {
          secure: true,
        },
        gopay: {
          enable_callback: true,
          callback_url: `${baseUrl}/?page=result`,
        },
        callbacks: {
          finish: `${baseUrl}/?page=result`,
        },
      };

      const response = await fetch(MIDTRANS_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${midtransAuth}`,
          "X-Override-Notification": `${baseUrl}/api/callback`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.log(await response.json());
        return new Response("Gateway Error", { status: 400 });
      }

      const data = await response.json();

      if (existingDoc.documents[0].paymentId) {
        await databases.updateDocument(
          DATABASE_ID,
          PAYMENT_ID,
          existingDoc.documents[0].paymentId,
          {
            isPaid: "FALSE",
          }
        );
      }

      const payment = await databases.createDocument(
        DATABASE_ID,
        PAYMENT_ID,
        ID.unique(),
        {
          coreId: existingDoc.documents[0].$id,
          reference: orderId,
          isPaid: "WAIT",
        }
      );

      await databases.updateDocument(
        DATABASE_ID,
        CORE_ID,
        existingDoc.documents[0].$id,
        {
          paymentId: payment.$id,
        }
      );

      return Response.json(data.redirect_url);
    } catch (error) {
      console.log(error);
      return new Response("Internal Error", { status: 500 });
    }
  };
