import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import { ITemplate } from "@/interfaces/ITemplate";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom/userState";
import { ILog } from "@/interfaces/ILog";

export default function ModalFormLog({
  modal,
  setModal,
  formik,
  selectedLog,
  setSelectedLog,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  selectedLog: ILog | null;
  setSelectedLog: React.Dispatch<React.SetStateAction<ILog | null>>;
}) {
  const axios = useAxios();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const user = useRecoilValue(userState);

  async function initModal() {
    await axios.get("Template").then((res) => {
      const templatesData: ITemplate[] = res.data;

      const templatesFilter = templatesData.filter((template: ITemplate) => {
        return template.userId == user?.id;
      });
      setTemplates(templatesFilter);
    });
  }

  useEffect(() => {
    initModal();
  }, []);

  useEffect(() => {
    if (selectedLog) {
      formik.setFieldValue("title", selectedLog.title);
      formik.setFieldValue("beginTime", selectedLog.beginTime);
      formik.setFieldValue("endTime", selectedLog.endTime);
      formik.setFieldValue("content", selectedLog.text);
      if (templates.length > 0) {
        formik.setFieldValue("template", selectedLog.templateId);
        console.log(selectedLog.templateId, templates);
      }
    }
  }, [selectedLog, templates]);

  async function selectTemplate(templateId: string) {
    await axios.get(`Template/${templateId}`).then((res) => {
      const template: ITemplate = res.data;
      formik.setFieldValue("template", template.id);
      formik.setFieldValue("content", template.text);
    });
  }

  return (
    <Dialog
      open={modal}
      onOpenChange={() => {
        setModal(false);
        setSelectedLog(null);
        formik.resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Log</DialogTitle>
          <DialogDescription>
            Create a new Log for a day and add it to the list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col  gap-2">
              <Label htmlFor="title" className="font-bold text-sm">
                Title
              </Label>
              <Input
                value={formik.values.title}
                onChange={formik.handleChange}
                name="title"
                id="title"
                placeholder="Title"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-col  gap-2">
                <Label htmlFor="beginTime" className="font-bold text-sm">
                  Begin Time
                </Label>
                <input
                  type="time"
                  className="p-1 focus:outline-none border focus:border-neutral-900 duration-300 rounded-lg"
                  value={formik.values.beginTime}
                  onChange={formik.handleChange}
                  name="beginTime"
                  id="beginTime"
                  placeholder="Begin Time"
                />
              </div>
              <div className="flex flex-col  gap-2">
                <Label htmlFor="beginTime" className="font-bold text-sm">
                  End Time
                </Label>
                <input
                  type="time"
                  className="p-1 focus:outline-none border focus:border-neutral-900 duration-300 rounded-lg"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  name="endTime"
                  id="endTime"
                  placeholder="End Time"
                />
              </div>
            </div>
            <div className="flex flex-col  gap-2">
              <Label htmlFor="content" className="font-bold text-sm">
                Template
              </Label>
              <Select
                onValueChange={(e) => selectTemplate(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col  gap-2">
              <Label htmlFor="content" className="font-bold text-sm">
                Content
              </Label>
              <Textarea
                value={formik.values.content}
                rows={6}
                onChange={formik.handleChange}
                name="content"
                id="content"
                placeholder="Content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{selectedLog ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
