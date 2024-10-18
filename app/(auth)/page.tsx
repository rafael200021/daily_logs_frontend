'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function Page() {
  const axios = useAxios();
  const navigate = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      axios
        .post("Auth", values)
        .then((res) => {

          const token = res.data.token;

          localStorage.setItem("token", token);

          navigate.push("/platform/logs");

        })
        .catch((err) => {
          toast.error("Invalid email or password");
          console.log(err);
        });
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full  lg:px-20 text-center flex items-center flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-center">
            Save everything you did today in one place
          </h1>
          <h2 className="text-neutral-400 text-[12px] mt-2 text-center mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            dolores laudantium maiores nulla hic.
          </h2>
        </div>

        <div className="grid w-full items-center gap-2">
          <Label className="font-bold" htmlFor="email">
            Email
          </Label>
          <Input onChange={formik.handleChange} value={formik.values.email} name="email" type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full mt-4 items-center gap-2">
          <Label className="font-bold" htmlFor="password">
            Password
          </Label>
          <Input type="password" onChange={formik.handleChange} value={formik.values.password} name="password" id="password" placeholder="Password" />
        </div>
        <div className="flex justify-end mt-2">
        <Link href="/register" className="text-sm font-bold hover:underline duration-300 hover:text-neutral-500 text-neutral-400">Register</Link>
        </div>
        <button className="mt-6 border bg-neutral-900 hover:bg-neutral-950 text-white py-3 w-full text-sm duration-300 rounded-full">
          Sign Up
        </button>
      </form>
    </>
  );
}
