import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom/userState";
import useAxios from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Profile({
  modal,
  setModal,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user = useRecoilValue(userState);
  const axios = useAxios();
  const navigate = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    onSubmit: (values) => {
      const data = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      if (user) {
        axios.put(`User/${user.id}`, data).then((res) => {
            console.log(res);
            localStorage.clear();
            toast.success("Profile updated successfully");
            navigate.push("/");

        })
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Edit your profile.</DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col  gap-2">
              <Label htmlFor="name" className="font-bold text-sm">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col  gap-2">
              <Label htmlFor="email" className="font-bold text-sm">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col  gap-2">
              <Label htmlFor="phone" className="font-bold text-sm">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.phone}
                placeholder="Phone"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
