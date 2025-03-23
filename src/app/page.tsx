"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, dataResponse } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  ArrowRight,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronRight,
  Clipboard,
  Clock,
  ClockIcon,
  CloudUpload,
  Download,
  FileIcon,
  FileText,
  Loader,
  Search,
  TrendingUpIcon,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import Link from "next/link";

export default function Home() {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedOverview, setCopiedOverview] = useState(false);
  const cai = dataResponse.critical_areas_for_improvement;
  const tca = dataResponse.top_competitive_advantages;
  const dca = dataResponse.detailed_category_analysis;
  const rap = dataResponse.recommended_action_plan;
  const mi = dataResponse.market_intelligence;
  const rpd = dataResponse.rewritten_profile_draft;
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useQueryState("page", { defaultValue: "" });
  const router = useRouter();

  const [current, setCurrent] = useState<{
    message: string;
    source: boolean;
    data: string | null;
    isPaid: "SUCCESS" | "FALSE" | "WAIT" | null;
  } | null>(null);

  const scores = dca.data.map((item) => item.score);
  const overallScore = (
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  ).toFixed(1);

  type MiProps = {
    title: string;
    trend: string;
    action: string;
  };

  const transformDataForTable = (data: MiProps[]) => {
    if (data.length < 1)
      throw new Error("Need at least one item for this format");

    const tableData = [
      ["#", ...data.map((item) => item.title)],
      ["Trend", ...data.map((item) => item.trend)],
      ["Action", ...data.map((item) => item.action)],
    ];

    return tableData;
  };

  const miProcessed = transformDataForTable(mi.data);

  interface TableRow {
    [key: string]: string;
  }

  const columns: ColumnDef<TableRow>[] = miProcessed[0].map(
    (header, index) => ({
      accessorKey: `col${index}`,
      header: header,
    })
  );

  const formattedData: TableRow[] = miProcessed
    .slice(1)
    .map((row) =>
      row.reduce((acc, cell, index) => ({ ...acc, [`col${index}`]: cell }), {})
    );

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(rpd.title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 3000);
    } catch (err) {
      console.error("Title Failed to copy:", err);
      toast.error("Title failed to copy");
    }
  };

  const handleCopyOverview = async () => {
    try {
      await navigator.clipboard.writeText(rpd.overview);
      setCopiedOverview(true);
      setTimeout(() => setCopiedOverview(false), 3000);
    } catch (err) {
      console.error("Overview Failed to copy:", err);
      toast.error("Overview failed to copy");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    if (acceptedFiles.length === 0) {
      return;
    }

    const selectedFile = acceptedFiles[0];

    // Check if file is a PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleViewAnalysis = () => {
    // Navigate to the profile analyzer page
    router.push("/profile-analyzer");
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const getCurrent = async () => {
    setIsLoading(true);
    try {
      const msg = await fetch("/api/current", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!msg.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await msg.json();
      setCurrent(data);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  };

  const sendPDF = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const phase1 = setInterval(() => {
        setUploadProgress((prev) => (prev < 50 ? prev + 5 : 50));
      }, 200);

      const msg = await fetch("/api/send", {
        method: "POST",
        body: formData,
      });

      if (!msg.ok) {
        throw new Error("Failed to fetch");
      }

      clearInterval(phase1);

      const phase2 = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(phase2);
            setIsUploading(false);
            setUploadComplete(true);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      getCurrent();
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDragActive) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = ""; // Balikin scroll
    }

    return () => {
      document.body.style.overflow = ""; // Pastikan reset saat komponen unmount
    };
  }, [isDragActive]);

  useEffect(() => {
    getCurrent();
  }, []);

  if (!current) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-3 pt-8">
        <Navbar />
        <Loader className="size-7 animate-spin" />
        <p className="animate-pulse">Memuat content</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full pt-8">
      <Navbar />
      {page === "" && (
        <div className="w-full pt-8 max-w-7xl mx-auto flex flex-col items-center md:justify-center h-full gap-4 lg:px-8 md:px-6 px-4">
          <div className="text-center mb-5 md:mb-10 pt-8">
            <Badge
              variant="outline"
              className="mb-4 rounded-full px-3 py-1 bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            >
              🚀 Grow Wealthier, Work Smarter.
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Upwork Profile Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Advanced AI analysis of your Upwork profile to boost visibility,
              win rates, and earning potential
            </p>
          </div>

          <div
            className={cn(
              "mb-6 md:mb-12 overflow-hidden flex-none rounded-2xl border border-gray-100 dark:border-gray-700 h-60 xs:h-52 md:h-24 flex items-center shadow bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/70 dark:to-gray-900 w-full",
              isDragActive && "border-gray-500"
            )}
          >
            {!current?.source && !file && !uploadComplete && !isUploading && (
              <div
                {...getRootProps()}
                className="flex items-center justify-center gap-6 md:justify-between h-full px-4 md:px-6 w-full flex-col md:flex-row"
              >
                <div className="flex items-center gap-3 flex-col md:flex-row">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-3">
                    {isDragActive ? (
                      <Download className="size-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Upload className="size-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-center md:text-left">
                      {isDragActive
                        ? "Drop your PDF file here"
                        : "Upload Your Upwork Profile"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                      {isDragActive
                        ? "Accepts PDF files up to 10MB"
                        : "Export your profile as PDF and upload it for analysis"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <p className="hidden lg:block">Drag & Drop here</p>
                  <div className="size-8 hidden lg:flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                    <p>or</p>
                  </div>
                  <Button
                    size="sm"
                    className="!px-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                  >
                    <CloudUpload />
                    Upload
                  </Button>
                </div>
                <input {...getInputProps()} />
              </div>
            )}
            {!current?.source && file && !uploadComplete && !isUploading && (
              <div className="flex items-center gap-6 justify-center md:justify-between h-full px-4 md:px-6 w-full relative flex-col md:flex-row">
                <div className="flex items-center gap-3 md:flex-1 min-w-0 flex-col md:flex-row">
                  <div className="flex size-10 flex-none items-center justify-center rounded-md bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shadow-sm border border-gray-100 dark:border-gray-800">
                    <FileIcon className="size-5 text-gray-600 dark:text-gray-300" />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-medium line-clamp-1 md:truncate text-center md:text-left">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-400 justify-center md:justify-start">
                      <span>PDF Document</span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-none">
                  <Button
                    variant="ghost"
                    onClick={removeFile}
                    className="md:size-8 md:p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <span className="md:hidden">Remove</span>
                  </Button>

                  <Button onClick={sendPDF}>Analyze Now</Button>
                </div>
              </div>
            )}
            {!current?.source && file && isUploading && (
              <div className="flex flex-col justify-center h-full px-4 md:px-6 w-full relative">
                <div className="mb-4 md:mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-gray-600 dark:bg-gray-300"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                      Analyzing your profile...
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                />
                <div className="mt-4 md:mt-2.5 flex flex-col md:flex-row gap-1 items-center md:justify-between text-xs text-gray-600 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Estimated time: ~30 seconds</span>
                  </div>
                  <span>
                    Analyzing{" "}
                    {uploadProgress < 50 ? "profile data" : "market trends"}
                  </span>
                </div>
              </div>
            )}
            {(current?.source || (uploadComplete && !isUploading)) && (
              <div className="flex items-center gap-6 justify-center md:justify-between md:h-full px-6 w-full relative flex-col md:flex-row">
                <div className="flex items-center gap-3 flex-1 min-w-0 flex-col md:flex-row">
                  <div className="flex size-10 flex-none items-center justify-center rounded-md bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shadow-sm border border-gray-100 dark:border-gray-800">
                    <CheckCircle className="size-5 text-gray-600 dark:text-gray-300" />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-center md:text-left">
                      Analysis Complete
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate text-center md:text-left">
                      Profile analyzed. View your report for insights.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-none">
                  <Button className="flex items-center gap-2" asChild>
                    <Link href="/?page=result">
                      View Detailed Report
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-16 py-6 px-3 md:py-10 md:px-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800/70 dark:via-gray-900 dark:to-gray-800/70 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-1">Key Analysis Features</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Three powerful tools to transform your Upwork profile
              </p>
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-3">
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-950 p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-200 dark:bg-green-700 p-2 rounded-full">
                    <Search className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </div>
                  <h3 className="font-semibold">Precision Analysis</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                  Data-driven insights from 50+ profile metrics to identify
                  exact strengths and weaknesses.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900 dark:to-amber-950 p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-200 dark:bg-amber-700 p-2 rounded-full">
                    <Users className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </div>
                  <h3 className="font-semibold">Personalized Strategy</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                  Tailored recommendations based on your unique skills, project
                  history, and client feedback.
                </p>
              </div>

              <div className="bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900 dark:to-violet-950 p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-violet-200 dark:bg-violet-700 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </div>
                  <h3 className="font-semibold">Actionable Roadmap</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                  Clear implementation plan with prioritized steps to transform
                  your profile and boost earnings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "result" && (
        <div className="w-full pt-8 max-w-7xl mx-auto flex flex-col gap-4 lg:px-8 md:px-6 px-4">
          <Card className="border-0 shadow-none">
            <CardHeader className="gap-0 p-0">
              <CardTitle className="text-xl font-bold">
                Executive Summary
              </CardTitle>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-3 p-0 text-sm leading-relaxed">
              {dataResponse.executive_summary}
            </CardContent>
          </Card>
          <Separator className="bg-gray-400" />
          <div className="flex flex-col w-full gap-6 py-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="h-auto bg-transparent dark:bg-transparent dark:hover:bg-gray-800/40 justify-between !px-3 md:!px-5 py-1.5 md:py-3 hover:bg-gray-100"
                  variant={"outline"}
                >
                  <Card className="border-0 shadow-none p-0 text-start">
                    <CardHeader className="gap-0 p-0">
                      <CardTitle className="text-base font-bold">
                        Critical Areas for Improvement
                      </CardTitle>
                      <CardDescription className="text-sm whitespace-pre-wrap md:whitespace-nowrap">
                        {cai.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <ChevronRight />
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:min-w-6xl lg:p-6 md:p-4 p-2 w-full">
                <DialogHeader className="gap-0 pl-1 text-start">
                  <DialogTitle className="text-lg font-bold">
                    Critical Areas for Improvement
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    {cai.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col gap-3 p-0 max-h-[80vh] overflow-y-auto pr-2 lg:pr-5 rounded-md">
                  {cai.data.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col gap-1.5 py-4 even:bg-gray-100 dark:even:bg-gray-800/70 px-0 lg:px-3 rounded-md"
                    >
                      <h4 className="text-lg font-semibold mb-1 px-2 lg:px-0">
                        {item.title}
                      </h4>
                      <span className="text-sm leading-relaxed px-2">
                        <strong>Issue:</strong> {item.issue}
                      </span>
                      <span className="text-sm leading-relaxed px-2">
                        <strong>Impact:</strong> {item.impact}
                      </span>
                      <div className="bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded-md w-fit flex items-center">
                        <span className="text-sm leading-relaxed">
                          <strong>Fix:</strong> {item.fix}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="h-auto bg-transparent dark:bg-transparent dark:hover:bg-gray-800/40 justify-between !px-3 md:!px-5 py-1.5 md:py-3 hover:bg-gray-100"
                  variant={"outline"}
                >
                  <Card className="border-0 shadow-none p-0 text-start">
                    <CardHeader className="gap-0 p-0">
                      <CardTitle className="text-base font-bold">
                        Critical Areas for Improvement
                      </CardTitle>
                      <CardDescription className="text-sm whitespace-pre-wrap md:whitespace-nowrap">
                        {cai.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <ChevronRight />
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:min-w-6xl lg:p-6 md:p-4 p-2 w-full">
                <DialogHeader className="gap-0 pl-1 text-start">
                  <DialogTitle className="text-lg font-bold">
                    Top Competitive Advantages
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    {tca.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col gap-3 p-0 max-h-[80vh] overflow-y-auto pr-2 lg:pr-5 rounded-md">
                  {tca.data.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col gap-1.5 py-4 even:bg-gray-100 dark:even:bg-gray-800/70 px-0 lg:px-3 rounded-md"
                    >
                      <h4 className="text-lg font-semibold mb-1 px-2 lg:px-0">
                        {item.title}
                      </h4>
                      <span className="text-sm leading-relaxed px-2">
                        {item.data}
                      </span>
                      <div className="bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded-md w-fit flex items-center">
                        <span className="text-sm leading-relaxed">
                          {item.edge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="bg-gray-400" />
          <Card className="border-0 shadow-none">
            <CardHeader className="gap-0 p-0">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="flex flex-col">
                  <CardTitle className="text-xl font-bold">
                    Detailed Category Analysis
                  </CardTitle>
                  <CardDescription className="text-base">
                    {dca.description}
                  </CardDescription>
                </div>
                <div className="flex md:flex-col flex-row-reverse items-center flex-none px-5 py-2 md:py-0 bg-gray-100 dark:bg-gray-800/50 md:bg-transparent md:dark:bg-transparent w-full md:w-auto mt-3 md:mt-0 rounded-md">
                  <div className="md:text-3xl text-xl font-bold w-full flex justify-center whitespace-nowrap">
                    {overallScore}
                  </div>
                  <div className="md:text-xs text-sm text-gray-600 dark:text-gray-300 md:text-muted-foreground w-full flex justify-center whitespace-nowrap">
                    Overall Score
                  </div>
                </div>
              </div>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-3 p-0">
              <Accordion
                type="single"
                collapsible
                className="flex w-full flex-col border rounded-lg"
                defaultValue={dca.data[0].title}
              >
                {dca.data.map((item) => (
                  <AccordionItem
                    key={item.title}
                    value={item.title}
                    className="md:data-[state=open]:pb-5 data-[state=open]:pb-4"
                  >
                    <AccordionTrigger className="hover:no-underline data-[state=open]:border-0 md:px-5 px-4 items-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                        <h4 className="md:text-lg text-base font-semibold mb-1 group-hover:underline group-hover:underline-offset-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="md:text-sm text-xs leading-relaxed">
                            {item.score}/10
                          </span>
                          <Progress
                            value={item.score * 10}
                            className="md:w-20 h-1.5"
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-800/70 pt-4 rounded-md mx-4 md:mx-5">
                      <span className="text-sm leading-relaxed px-2">
                        <strong></strong> {item.logic}
                      </span>
                      <span className="text-sm leading-relaxed px-2">
                        <strong>Benchmark:</strong> {item.benchmark}
                      </span>
                      <span className="text-sm leading-relaxed px-2">
                        <strong>Insight:</strong> {item.insight}
                      </span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          <Separator className="bg-gray-400" />
          <Card className="border-0 shadow-none">
            <CardHeader className="gap-0 p-0">
              <CardTitle className="text-xl font-bold">
                Recommended Action Plan
              </CardTitle>
              <CardDescription className="text-base">
                {rap.description}
              </CardDescription>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="w-full grid md:grid-cols-3 gap-3 p-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="gap-3 md:gap-4 lg:gap-6 items-center h-auto py-3 justify-between hover:bg-gray-100 dark:bg-transparent dark:hover:bg-gray-800/40"
                    variant={"outline"}
                  >
                    <div className="gap-3 flex items-center">
                      <ClockIcon className="text-gray-500" />
                      Immediate Actions
                    </div>
                    <Badge className="rounded-full bg-red-200 hover:bg-red-200 text-black">
                      Do Now
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:min-w-6xl lg:p-6 md:p-4 p-2 w-full">
                  <DialogHeader className="gap-0 pl-1 text-start">
                    <DialogTitle className="text-lg font-bold">
                      Immediate Actions
                    </DialogTitle>
                    <DialogDescription>
                      <Badge className="rounded-full bg-red-200 hover:bg-red-200 text-black">
                        Do Now
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-3 p-0 max-h-[80vh] overflow-y-auto pr-2 lg:pr-5 rounded-md">
                    {rap.data.immediate.map((item) => (
                      <div
                        key={item.title}
                        className="flex flex-col gap-1.5 py-4 even:bg-gray-100 dark:even:bg-gray-800/70 px-0 lg:px-3 rounded-md group"
                      >
                        <div className="flex flex-col px-2 lg:px-0">
                          <h4 className="text-lg font-semibold">
                            {item.title}
                          </h4>
                          <span className="text-sm leading-relaxed mb-1">
                            <strong></strong> {item.task}
                          </span>
                        </div>
                        {item.sample && (
                          <span className="text-sm leading-relaxed px-2 py-1 rounded w-fit bg-gray-100 group-even:bg-gray-200 dark:bg-gray-800 group-even:dark:bg-gray-700">
                            <strong>Example:</strong> {item.sample}
                          </span>
                        )}
                        <span className="text-sm leading-relaxed lowercase px-2">
                          <span className="capitalize">Because</span> {item.why}
                        </span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="gap-3 md:gap-4 lg:gap-6 items-center h-auto py-3 justify-between hover:bg-gray-100 dark:bg-transparent dark:hover:bg-gray-800/40"
                    variant={"outline"}
                  >
                    <div className="gap-3 flex items-center">
                      <CalendarIcon className="text-gray-500" />
                      Short-Term Actions
                    </div>
                    <Badge className="rounded-full bg-gray-200 hover:bg-gray-200 text-black">
                      Next Week
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:min-w-6xl lg:p-6 md:p-4 p-2 w-full">
                  <DialogHeader className="gap-0 pl-1 text-start">
                    <DialogTitle className="text-lg font-bold">
                      Short-Term Actions
                    </DialogTitle>
                    <DialogDescription>
                      <Badge className="rounded-full bg-gray-200 hover:bg-gray-200 text-black">
                        Next Week
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-3 p-0 max-h-[80vh] overflow-y-auto pr-2 lg:pr-5 rounded-md">
                    {rap.data.short_term.map((item) => (
                      <div
                        key={item.title}
                        className="flex flex-col gap-1.5 py-4 even:bg-gray-100 dark:even:bg-gray-800/70 px-0 lg:px-3 rounded-md group"
                      >
                        <div className="flex flex-col px-2 lg:px-0">
                          <h4 className="text-lg font-semibold">
                            {item.title}
                          </h4>
                          <span className="text-sm leading-relaxed mb-1">
                            <strong></strong> {item.task}
                          </span>
                        </div>
                        {item.sample && (
                          <span className="text-sm leading-relaxed px-2 py-1 rounded w-fit bg-gray-100 group-even:bg-gray-200 dark:bg-gray-800 group-even:dark:bg-gray-700">
                            <strong>Example:</strong> {item.sample}
                          </span>
                        )}
                        <span className="text-sm leading-relaxed lowercase px-2">
                          <span className="capitalize">Because</span> {item.why}
                        </span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="gap-3 md:gap-4 lg:gap-6 items-center h-auto py-3 justify-between hover:bg-gray-100 dark:bg-transparent dark:hover:bg-gray-800/40"
                    variant={"outline"}
                  >
                    <div className="gap-3 flex items-center">
                      <TrendingUpIcon className="text-gray-500" />
                      Long-Term
                    </div>
                    <Badge
                      variant={"outline"}
                      className="rounded-full bg-transparent hover:bg-transparent group-hover:border-gray-400"
                    >
                      Next Month
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:min-w-6xl lg:p-6 md:p-4 p-2 w-full">
                  <DialogHeader className="gap-0 pl-1 text-start">
                    <DialogTitle className="text-lg font-bold">
                      Long-Term Actions
                    </DialogTitle>
                    <DialogDescription>
                      <Badge
                        variant={"outline"}
                        className="rounded-full bg-transparent hover:bg-transparent group-hover:border-gray-400"
                      >
                        Next Month
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-3 p-0 max-h-[80vh] overflow-y-auto pr-2 lg:pr-5 rounded-md">
                    {rap.data.long_term.map((item) => (
                      <div
                        key={item.title}
                        className="flex flex-col gap-1.5 py-4 even:bg-gray-100 dark:even:bg-gray-800/70 px-0 lg:px-3 rounded-md group"
                      >
                        <div className="flex flex-col px-2 lg:px-0">
                          <h4 className="text-lg font-semibold">
                            {item.title}
                          </h4>
                          <span className="text-sm leading-relaxed mb-1">
                            <strong></strong> {item.task}
                          </span>
                        </div>
                        {item.sample && (
                          <span className="text-sm leading-relaxed px-2 py-1 rounded w-fit bg-gray-100 group-even:bg-gray-200 dark:bg-gray-800 group-even:dark:bg-gray-700">
                            <strong>Example:</strong> {item.sample}
                          </span>
                        )}
                        <span className="text-sm leading-relaxed lowercase px-2">
                          <span className="capitalize">Because</span> {item.why}
                        </span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Separator className="bg-gray-400" />
          <Card className="border-0 shadow-none">
            <CardHeader className="gap-0 p-0">
              <CardTitle className="text-xl font-bold">
                Market Intelligence
              </CardTitle>
              <CardDescription className="text-base">
                {mi.description}
              </CardDescription>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-3 p-0">
              <DataTable data={formattedData} columns={columns} />
            </CardContent>
          </Card>
          <Separator className="bg-gray-400" />
          <Card className="border-0 shadow-none">
            <CardHeader className="gap-0 p-0">
              <CardTitle className="text-xl font-bold">
                Rewritten Profile Draft
              </CardTitle>
              <CardDescription className="text-base">
                Copy and paste this improved profile to your Upwork account
              </CardDescription>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-6 p-0">
              <div className="border rounded-lg w-full group overflow-hidden">
                <div className="w-full flex items-center group-hover:bg-gray-50 group-hover:dark:bg-gray-800 justify-between border-b px-5 py-2">
                  <p className="font-semibold">Title</p>
                  <Button
                    className="size-8 hover:bg-gray-200 hover:dark:bg-gray-700"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={handleCopyTitle}
                  >
                    {copiedTitle ? <Check /> : <Clipboard />}
                  </Button>
                </div>
                <p className="p-5 text-sm leading-relaxed">{rpd.title}</p>
              </div>
              <div className="border rounded-lg w-full group overflow-hidden">
                <div className="w-full flex items-center group-hover:bg-gray-50 group-hover:dark:bg-gray-800 justify-between border-b px-5 py-2">
                  <p className="font-semibold">Overview</p>
                  <Button
                    className="size-8 hover:bg-gray-200 hover:dark:bg-gray-700"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={handleCopyOverview}
                  >
                    {copiedOverview ? <Check /> : <Clipboard />}
                  </Button>
                </div>
                <p className="p-5 text-sm leading-relaxed">{rpd.overview}</p>
              </div>
            </CardContent>
          </Card>
          <Separator className="bg-gray-400" />
          <Card className="border-0 shadow-none mb-5 md:mb-10 lg:mb-20">
            <CardHeader className="gap-0 p-0">
              <CardTitle className="text-xl font-bold">
                Closing Motivation
              </CardTitle>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-3 p-0 text-sm leading-relaxed">
              {dataResponse.closing_motivation}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
