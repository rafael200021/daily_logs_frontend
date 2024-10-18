"use client";
import { useEffect } from "react";
import Menu from "../components/Menu";
import useAxios from "@/hooks/useAxios";
import { userState } from "@/atom/userState";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const axios = useAxios();
  const [, setUser] = useRecoilState(userState);
  const navigate = useRouter();
  useEffect(() => {
    axios
      .get("User/Auth")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate.push("/");
      });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Menu />
      {children}
    </div>
  );
}
