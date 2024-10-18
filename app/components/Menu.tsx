"use client";
import { userState } from "@/atom/userState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Waves } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import Profile from "./Profile";

export default function Menu() {
  const user = useRecoilValue(userState);
  const navigate = useRouter();
  const [modal, setModal] = useState(false);

  function LogOut() {
    localStorage.clear();
    navigate.push("/");
  }

  return (
    <div className="px-10 w-full py-4 text-white flex justify-between items-center bg-neutral-800">
      <div className="flex gap-8 items-end">
        <h1 className="font-extrabold text-2xl flex gap-2 items-center">
          <Link href={"/platform/logs"} className="flex items-center gap-2">
            <Waves /> DailyLog
          </Link>
        </h1>
        <ul className="flex  text-sm gap-4 items-center ">
          <li className="hover:underline duration-300">
            <Link href={"/platform/logs"}>Daily Logs</Link>
          </li>
          <li className="hover:underline duration-300">
            <Link href={"/platform/templates"}>Templates</Link>
          </li>
        </ul>
      </div>
      <Profile modal={modal} setModal={setModal}/>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-14 text-black font-bold h-14 flex justify-center items-center rounded-full bg-white">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setModal(true)} className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={LogOut}>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
