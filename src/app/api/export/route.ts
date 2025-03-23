import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { CORE_ID, DATABASE_ID } from "@/config";
import { Query } from "node-appwrite";
import { marked } from "marked";
import { chromium } from "playwright";

export async function POST() {
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

    const markdown = existingDoc.documents[0].response as string;

    const htmlContent = `
      <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: "Inter", sans-serif;
              font-size: 12px;
              line-height: 20px;
              padding: 0;
              margin: 0;
            }
            .header {
              font-family: 'Inter', sans-serif;
            }
            @page {
              margin: 80px;
              margin-top: 100px;
            }
            .prose {
              color: #374151;
            }
            .prose h1, .prose h2, .prose h3 {
              font-weight: 700;
              color: #111827;
            }
            .prose h2 {
              font-size: 18px;
                margin-top: 28px;
                margin-bottom: 14px;
                line-height: 25px;
            }
            .prose h3 {
              font-size: 16px;
                margin-top: 25px;
                margin-bottom: 7px;
                line-height: 25px;
            }
            .prose p {
            margin-top: 14px;
            margin-bottom: 14px;
              text-align: justify;
            }
            .prose ul {
              margin-top: 0.75rem;
              margin-bottom: 0.75rem;
              padding-left: 1.5rem;
            }
            .prose li {
              text-align: justify;
              margin-bottom: 0.5rem;
            }
            .prose hr {
              border-color: #d1d5db;
            }
            .prose h2:first-of-type {
              margin-top: 0;
            }
          </style>
        </head>
        <body class="prose prose-sm lg:prose-base prose-p:my-3 prose-ul:my-3 prose-h2:mt-10 prose-h2:mb-2 leading-relaxed prose-p:text-justify prose-li:text-justify prose-hr:border-gray-300">
          ${marked(markdown)}
        </body>
      </html>
    `;

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="display: flex; width: 100%; gap: 12px; justify-content: flex-start; align-items: center; padding-inline: 40px; border-bottom: 1px solid #000000; padding-bottom: 16px;">
            <svg viewBox="0 0 49 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                <path
                d="M37.3947 40C43.8275 39.8689 49 34.6073 49 28.1389C49 24.9931 47.7512 21.9762 45.5282 19.7518L25.7895 0V12.2771C25.7895 14.3303 26.6046 16.2995 28.0556 17.7514L32.6795 22.3784L32.6921 22.3907L40.4452 30.149C40.697 30.4009 40.697 30.8094 40.4452 31.0613C40.1935 31.3133 39.7852 31.3133 39.5335 31.0613L36.861 28.3871H12.139L9.46655 31.0613C9.21476 31.3133 8.80654 31.3133 8.55476 31.0613C8.30297 30.8094 8.30297 30.4009 8.55475 30.149L16.3079 22.3907L16.3205 22.3784L20.9444 17.7514C22.3954 16.2995 23.2105 14.3303 23.2105 12.2771V0L3.47175 19.7518C1.24882 21.9762 0 24.9931 0 28.1389C0 34.6073 5.17252 39.8689 11.6053 40H37.3947Z"
                fill="#FF0A0A"
                ></path>
            </svg>
            <div style="display: flex; flex-direction: column;">
                <h1 style="font-size: 16px; font-weight: bold; line-height: 1; margin: 0">
                Tes Minat & Bakat
                </h1>
                <p style="font-size: 12px; margin: 0">By AI Wrapper</p>
            </div>
        </div>
      `,
      footerTemplate: "<div></div>",
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="minbak.pdf"',
      },
    });
  } catch (error) {
    console.log("GENERATE_PDF_ERROR:", error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
