"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import { FormikErrors, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function Page() {
  const axios = useAxios();
  const navigate = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {};

      if (!values.name) {
        errors.name = "Required";
      }

      if (!values.email) {
        errors.email = "Required";
      }

      if (!values.phone) {
        errors.phone = "Required";
      }

      if (!values.password) {
        errors.password = "Required";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Required";
      }

      if (values.confirmPassword != values.password) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },
    onSubmit: (values) => {
      const data = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };
      axios
        .post("User", data)
        .then(() => {
          toast.success("Account created successfully");
          navigate.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full  lg:px-20 text-center flex items-center flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-center">Register</h1>
          <h2 className="text-neutral-400 text-[12px] mt-2 text-center mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            dolores laudantium maiores nulla hic.
          </h2>
        </div>
        <div className="grid w-full items-center gap-2">
          <Label className="font-bold" htmlFor="name">
            Name
          </Label>
          <Input
            onChange={formik.handleChange}
            value={formik.values.name}
            name="name"
            type="text"
            id="name"
            placeholder="Name"
          />
          {formik.errors.name && (
            <p className="text-red-500 text-[12px] font-semibold">
              {formik.errors.name}
            </p>
          )}
        </div>
        <div className="grid w-full items-center gap-2 mt-4">
          <Label className="font-bold" htmlFor="email">
            Email
          </Label>
          <Input
            onChange={formik.handleChange}
            value={formik.values.email}
            name="email"
            type="email"
            id="email"
            placeholder="Email"
          />
          {formik.errors.email && (
            <p className="text-red-500 text-[12px] font-semibold">
              {formik.errors.email}
            </p>
          )}
        </div>
        <div className="grid w-full items-center gap-2 mt-4">
          <Label className="font-bold" htmlFor="phone">
            Phone
          </Label>
          <Input
            onChange={formik.handleChange}
            value={formik.values.phone}
            name="phone"
            type="text"
            id="phone"
            placeholder="Phone"
          />
          {formik.errors.phone && (
            <p className="text-red-500 text-[12px] font-semibold">
              {formik.errors.phone}
            </p>
          )}
        </div>
        <div className="grid w-full mt-4 items-center gap-2">
          <Label className="font-bold" htmlFor="password">
            Password
          </Label>
          <Input
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            id="password"
            placeholder="Password"
          />
          {formik.errors.password && (
            <p className="text-red-500 text-[12px] font-semibold">
              {formik.errors.password}
            </p>
          )}
        </div>
        <div className="grid w-full mt-4 items-center gap-2">
          <Label className="font-bold" htmlFor="confirmPassword">
            Confirm Password
          </Label>
          <Input
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
          />
          {formik.errors.confirmPassword && (
            <p className="text-red-500 text-[12px] font-semibold">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <button className="mt-6 border bg-neutral-900 hover:bg-neutral-950 text-white py-3 w-full text-sm duration-300 rounded-full">
          Register
        </button>
        <div className="flex justify-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-bold hover:underline duration-300 hover:text-neutral-500 text-neutral-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
