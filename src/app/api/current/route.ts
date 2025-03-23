import { CORE_ID, DATABASE_ID, PAYMENT_ID } from "@/config";
import { generateToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSessionClient } from "@/lib/appwrite";

export const GET = async () => {
  const cookie = await cookies();

  const { databases } = await createSessionClient();

  const userId = cookie.get("UPAN_SESSION");
  const notif = cookie.get("notif");
  const setNotif = (data: string) => cookie.set("notif", data);
  const delNotif = () => cookie.delete("notif");

  if (!userId?.value) {
    let token;
    let isUnique = false;

    while (!isUnique) {
      token = generateToken(50);

      // Cek apakah token sudah ada di database
      const existingSessions = await databases.listDocuments(
        DATABASE_ID,
        CORE_ID,
        [Query.equal("sessionId", token)]
      );

      if (existingSessions.documents.length === 0) {
        isUnique = true;
      }
    }

    await databases.createDocument(DATABASE_ID, CORE_ID, ID.unique(), {
      sessionId: token,
      source: null,
      response: null,
      paymentId: null,
    });

    cookie.set("UPAN_SESSION", token as string, {
      maxAge: 30 * 24 * 60 * 60, // 30 hari dalam detik
      path: "/",
    });

    if (notif) {
      delNotif();
    }
    return Response.json({
      message: "User Created",
      isPaid: null,
      status: true,
      source: false,
      data: null,
    });
  }

  const userDoc = await databases.listDocuments(DATABASE_ID, CORE_ID, [
    Query.equal("sessionId", userId.value),
  ]);

  if (userDoc.total === 0) {
    let token;
    let isUnique = false;

    while (!isUnique) {
      token = generateToken(50);

      // Cek apakah token sudah ada di database
      const existingSessions = await databases.listDocuments(
        DATABASE_ID,
        CORE_ID,
        [Query.equal("sessionId", token)]
      );

      if (existingSessions.documents.length === 0) {
        isUnique = true;
      }
    }

    await databases.createDocument(DATABASE_ID, CORE_ID, ID.unique(), {
      sessionId: token,
      source: null,
      response: null,
      paymentId: null,
    });

    cookie.set("UPAN_SESSION", token as string, {
      maxAge: 30 * 24 * 60 * 60, // 30 hari dalam detik
      path: "/",
    });

    if (notif) {
      delNotif();
    }
    return Response.json({
      message: "User Created",
      isPaid: null,
      status: true,
      source: false,
      data: null,
    });
  }

  const docFound = userDoc.documents[0];

  if (!docFound.source && !docFound.paymentId) {
    if (notif) {
      delNotif();
    }
    return Response.json({
      message: "Welcome again. 1",
      isPaid: null,
      status: true,
      source: false,
      data: null,
    });
  }

  if (docFound.source && !docFound.paymentId) {
    if (notif) {
      delNotif();
    }
    return Response.json({
      message: "Welcome again. 2",
      isPaid: null,
      status: true,
      source: true,
      data: null,
    });
  }

  const payment = await databases.getDocument(
    DATABASE_ID,
    PAYMENT_ID,
    docFound.paymentId
  );

  if (docFound.source && !payment) {
    if (notif) {
      delNotif();
    }
    return Response.json({
      message: "Welcome again. 3",
      isPaid: null,
      status: true,
      source: true,
      data: null,
    });
  }

  if (!payment.isPaid || payment.isPaid !== "SUCCESS") {
    if (payment.isPaid === "FALSE") {
      setNotif("01");
    }
    return Response.json({
      message: "Welcome again. 4",
      isPaid: payment.isPaid,
      status: true,
      source: true,
      data: null,
    });
  }

  if (!docFound.response && payment.isPaid === "SUCCESS") {
    const finalPrompt = `
    🤖 AI Instruction (Enhanced Prompt)
    "You are an AI-powered career and educational assessment tool for Indonesian users. Based on a user's Likert-scale responses and additional contextual inputs, generate a detailed, personalized report on their interests, talents, and career growth potential."

    Your response must include:
    1️⃣ Minat & Bakat Analysis (With Real-Life Examples)
    Identify main interests & strengths based on patterns.
    Give real-world examples of how their strengths translate into careers.

    2️⃣ Personalized 30-Day Improvement Plan (NEW!)
    A structured, actionable plan to develop their talents.
    Includes daily/weekly activities like online courses, networking, and mini-projects.

    3️⃣ Self-Development Recommendations (With More Indonesian Bootcamps & Pricing!) (Expanded)
    Suggest relevant courses, bootcamps, certifications with prices.
    Cover local platforms like RevoU, Harisenin, MySkill, Binar Academy, Dicoding, etc.

    4️⃣ Hidden Talents Section (More Insights & Fun Surprises!) (Improved)
    Identify unexpected strengths the user might not realize they have.
    Example: "Your response pattern suggests strong intuitive decision-making, a key skill for entrepreneurship."
    Highlight how these hidden talents can be applied to careers.

    5️⃣ Educational Pathways (Updated with More Detail!)
    Suggest S1 & S2 programs based on minat & bakat.
    Include Universities in Indonesia & abroad with strong programs.

    6️⃣ Career & Salary Recommendations (More Personalized)
    Suggest specific job roles with estimated salaries in Indonesia.
    Indicate job demand trends & future-proof skills.

    Gunakan bahasa santai, menghibur, tetapi tetap profesional. Jawaban harus dalam bahasa Indonesia. buatkan dalam bentuk markdown saja!. 
    jangan lupa menambahkan 2 spasi diakhir agar membuat baris baru!
    tambah &nbsp; untuk spaci line yang lebih panjang untuk membedakan opening, isi dan closing! 
    jangan memakai 2 bintang (**) diakhir sebagai penanda akhir gunakan 2 spaci untuk new line! 
    nama role tidak boleh ada diresponse kecuali sudah diartikan menjadi bahasa indonesia yang baik!

    sekali lagi jangan lupa menambahkan 2 spasi diakhir agar membuat baris baru!
    dan sekali lagi jangan memakai 2 bintang (**) diakhir sebagai penanda akhir, gunakan 2 spaci untuk new line!

    contohnya seperti ini:
    ## 🔍 Analisis Minat & Bakat  
    Berdasarkan jawabanmu, kamu memiliki ketertarikan kuat dalam bidang **Analitis & Logika** serta **Manajerial & Kepemimpinan**.  

    ### 🏆 Minat Utama  
    📊 **Analitis & Logika** → Kamu suka memecahkan masalah dan menganalisis data. Cocok untuk **Data Science, Finance,** dan **Strategy Consulting**.  

    📢 **Komunikasi & Sosial** → Nyaman berbicara di depan umum dan menyelesaikan konflik, cocok untuk **Public Relations** atau **Sales**.  

    🛠 **Teknis & Digital** → Minat dalam teknologi dan pemrograman menunjukkan potensi dalam **Software Engineering** atau **UX/UI Design**.  

    ---

    ## 📈 30-Day Personalized Improvement Plan (NEW!)  
    🔥 **Goal:** Mengembangkan kemampuan analitis dan komunikasi profesional untuk meningkatkan prospek karier di bidang **Product Management** atau **Data Science**.  
    &nbsp;

    ### Week 1: Dasar-Dasar & Eksplorasi  
    📚 **Hari 1-2** → Ambil kursus _"Data Analytics Fundamentals"_ di **MySkill** _(Rp199.000)_  

    🎧 **Hari 3-4** → Dengarkan podcast tentang negosiasi & komunikasi bisnis  

    📖 **Hari 5-7** → Buat **mind map** karier berdasarkan minat & bakat  
    &nbsp;

    ### Week 2: Hands-on Experience  
    💻 **Hari 8-10** → Ikuti bootcamp _"Fundamental Digital Marketing"_ (**Harisenin**, Rp499.000)  

    📊 **Hari 11-12** → Analisis tren industri menggunakan **Google Trends & LinkedIn Insights**  

    📝 **Hari 13-14** → Tulis **ringkasan** dari 3 artikel industri terbaru untuk melatih komunikasi tertulis  
    &nbsp;

    ### Week 3: Networking & Practical Application  
    🤝 **Hari 15-17** → Hubungi **3 profesional di LinkedIn** yang bekerja di bidang yang diminati  

    📊 **Hari 18-19** → Buat laporan mini menggunakan **Google Sheets** untuk melatih analisis data  

    🎤 **Hari 20-21** → Rekam **video singkat (2 menit)** tentang topik favoritmu untuk melatih **public speaking**  
    &nbsp;

    ### Week 4: Final Execution & Next Steps  
    🛠 **Hari 22-25** → Kerjakan **proyek kecil** (misal: menganalisis tren media sosial selama 1 bulan)  

    📝 **Hari 26-28** → Ikuti **webinar** atau **mentoring** dari **Glints ExpertClass**  

    📌 **Hari 29-30** → **Review perjalananmu**, identifikasi kekuatan & area untuk perbaikan  

    ---

    ## 📚 Rekomendasi Pengembangan Diri (Updated with Indonesian Bootcamps!)
    Ingin meningkatkan keterampilan dan mempercepat karier? Berikut beberapa kursus dan bootcamp yang bisa membantumu berkembang di bidang yang kamu minati.  
    &nbsp;

    📊 **Data Science & Analytics** → _RevoU Mini Course (Rp500.000)_  
    📈 **Digital Marketing** → _Harisenin Bootcamp (Rp499.000)_  
    🎨 **UI/UX Design** → _Binar Academy (Rp699.000)_  
    🎤 **Leadership & Public Speaking** → _Glints ExpertClass (Rp300.000)_  
    🐍 **Python Programming** → _Dicoding Academy (Rp400.000)_  
    &nbsp;

    💡 **Long-Term Growth**  
      Pertimbangkan sertifikasi seperti **Certified Scrum Master (CSM)** untuk **Product Manager** atau **Google Data Analytics Certification** untuk **Data Science**.  

    ---

    ## 🕵️‍♂️ Hidden Talents (Talenta Tersembunyi - Improved!)  
    🎭 **Kejutan!** Jawabanmu menunjukkan bahwa kamu memiliki bakat tersembunyi dalam **adaptasi cepat & storytelling**.  
    &nbsp;

    🔥 **Kemampuan Adaptasi Cepat**  
      Kamu cepat menyesuaikan diri dalam situasi baru, kualitas penting bagi **entrepreneurs** dan **project managers**.  

    🎤 **Kekuatan Storytelling**  
      Kemampuan komunikasi yang kuat & daya tarik dalam menyampaikan ide, cocok untuk:  
        - Public Relations  
        - Brand Storytelling  
        - Content Creator  
    &nbsp;

    💡 **Next Steps:**  
      Mulai eksplorasi **branding & public speaking**  
      Latih storytelling dengan membuat **thread menarik di Twitter atau LinkedIn**  

    ---

    ## 🎓 Rekomendasi Pendidikan (Universitas & Jurusan)  
    Memilih pendidikan yang tepat bisa menjadi langkah awal menuju karier impian. Berikut beberapa rekomendasi universitas dan jurusan yang sesuai dengan minat dan bakatmu.  

    ### S1 (Sarjana):  
    📈 **Manajemen / Administrasi Bisnis** → UI, BINUS, ITB  

    🧠 **Psikologi** → UI, UGM, Unpad  

    💻 **Teknik Informatika / Data Science** → ITB, UI, BINUS  

    ### S2 (Magister):  
    📊 **MBA (Manajemen Bisnis)** → Prasetiya Mulya, SBM ITB  

    📈 **Magister Data Science** → UI, ITB  

    ---

    ## 💼 Rekomendasi Karier & Estimasi Gaji  
    Berdasarkan minat dan keahlianmu, berikut beberapa pilihan karier yang bisa kamu pertimbangkan, lengkap dengan estimasi gajinya.  
    &nbsp;

    🚀 **Product Manager** → _15 - 40 juta_  
    Kamu punya minat di analisis & manajerial  

    📊 **Data Analyst** → _10 - 30 juta_  
    Kamu suka data & problem-solving  

    🎨 **UX Designer** → _8 - 25 juta_  
    Kamu kreatif & suka memahami user behavior  

    🎯 **Marketing Strategist** → _10 - 25 juta_  
      Kamu punya storytelling & analisis yang kuat 
    `;

    const genAI = new GoogleGenerativeAI(process.env.PUBLIC_NEXT_KEY_GEMINI!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: finalPrompt,
            },
            {
              inlineData: {
                data: docFound.source,
                mimeType: "application/pdf",
              },
            },
          ],
        },
      ],
    });

    const updatedDoc = await databases.updateDocument(
      DATABASE_ID,
      CORE_ID,
      docFound.$id,
      {
        response: result.response.text(),
      }
    );

    const paymentUpdate = await databases.getDocument(
      DATABASE_ID,
      PAYMENT_ID,
      updatedDoc.paymentId
    );

    setNotif("00");

    return Response.json({
      message: "Welcome again. 5",
      isPaid: paymentUpdate.isPaid,
      status: true,
      source: true,
      data: updatedDoc.response,
    });
  }

  return Response.json({
    message: "Welcome again 6",
    isPaid: payment.isPaid,
    status: true,
    source: true,
    data: docFound.response,
  });
};
