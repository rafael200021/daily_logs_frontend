import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ITemplate } from "@/interfaces/ITemplate";

export default function ModalFormTemplate({
  modal,
  setModal,
  formik,
  template,
  setTemplate,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  template: ITemplate | undefined;
  setTemplate: React.Dispatch<React.SetStateAction<ITemplate | undefined>>;
}) {

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (template) {
      setIsEdit(true);
      formik.setFieldValue("name", template.name);
      formik.setFieldValue("content", template.text);
    }
  }, [template]);

  return (
    <Dialog
      open={modal}
      onOpenChange={() => {
        setModal(false);
        setTemplate(undefined);
        formik.resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Template</DialogTitle>
          <DialogDescription>
            Create a new Template and add it to the list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col  gap-2">
              <Label htmlFor="name" className="font-bold text-sm">
                Name
              </Label>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col  gap-2">
              <Label htmlFor="content" className="font-bold text-sm">
                Content
              </Label>
              <Textarea
                name="content"
                rows={6}
                value={formik.values.content}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
