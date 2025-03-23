"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MenuIcon, MoonStarIcon, SunDimIcon } from "lucide-react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import Image from "next/image";

export const Navbar = ({
  current,
}: {
  current?: {
    message: string;
    data: string | null;
    isPaid: "SUCCESS" | "FALSE" | "WAIT" | null;
    source: boolean;
  };
}) => {
  const [isMount, setIsMount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow border-b fixed top-0 left-0 z-20">
      <div className="w-full max-w-7xl mx-auto h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <Button
          className="flex-none cursor-pointer flex lg:hidden dark:bg-gray-900"
          size={"icon"}
          variant={"outline"}
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon />
        </Button>
        <Button
          className="flex-none md:text-lg font-bold"
          variant={"link"}
          asChild
        >
          <Link href="/">
            <div className="size-8 md:size-9 relative flex items-center justify-center">
              <Image
                src={"/upan.png"}
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
            Upwork Profile Analizer
          </Link>
        </Button>
        <div className="flex gap-10 items-center">
          <div className="items-center justify-center gap-2 hidden lg:flex">
            {current?.source && (
              <Button asChild variant={"link"}>
                <Link href={"/?page=result"}>Hasil Anda</Link>
              </Button>
            )}
            <Button asChild variant={"link"}>
              <Link href={"/"}>
                {current?.source ? "Analisis Profile" : "Analisis Ulang"}
              </Link>
            </Button>
            <Button asChild variant={"link"}>
              <Link href={"#"}>Hubungi Kami</Link>
            </Button>
            <Button asChild variant={"link"}>
              <Link href={"#"}>Syarat & Ketentuan</Link>
            </Button>
          </div>
          <Button
            className="flex-none cursor-pointer"
            size={"icon"}
            onClick={() => {
              if (theme === "light") {
                setTheme("dark");
              } else {
                setTheme("light");
              }
            }}
          >
            {theme === "light" && <MoonStarIcon />}
            {theme === "dark" && <SunDimIcon />}
          </Button>
        </div>
      </div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center underline underline-offset-2">
              Navigation
            </DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="items-center justify-center gap-2 flex flex-col">
            {current?.source && (
              <Button
                className="h-10"
                asChild
                variant={"link"}
                onClick={() => setIsOpen(false)}
              >
                <Link href={"/?page=result"}>Hasil Anda</Link>
              </Button>
            )}
            <Button
              className="h-10"
              asChild
              variant={"link"}
              onClick={() => setIsOpen(false)}
            >
              <Link href={"/"}>Test Minat & Bakat</Link>
            </Button>
            <Button
              className="h-10"
              asChild
              variant={"link"}
              onClick={() => setIsOpen(false)}
            >
              <Link href={"#"}>Hubungi Kami</Link>
            </Button>
            <Button
              className="h-10"
              asChild
              variant={"link"}
              onClick={() => setIsOpen(false)}
            >
              <Link href={"#"}>Syarat & Ketentuan</Link>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
