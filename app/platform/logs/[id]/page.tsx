"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useFormik } from "formik";

import useAxios from "@/hooks/useAxios";
import LogItem from "./components/LogItem";
import { ILog } from "@/interfaces/ILog";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom/userState";
import toast from "react-hot-toast";
import ModalFormLog from "./components/ModalFormLog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useParams();
  const [dailyLogs, setDailyLogs] = useState<ILog[]>([]);
  const [modal, setModal] = useState(false);
  const axios = useAxios();
  const user = useRecoilValue(userState);
  const [selectedLog, setSelectedLog] = useState<null | ILog>(null);

  const formik = useFormik<{
    title: string;
    beginTime: string;
    endTime: string;
    content: string;
    template: null | number;
  }>({
    initialValues: {
      title: "",
      beginTime: "",
      endTime: "",
      content: "",
      template: null,
    },
    onSubmit: async (values) => {
      const data = {
        title: values.title,
        beginTime: values.beginTime + (selectedLog ? "" : ":00"),
        endTime: values.endTime + (selectedLog ? "" : ":00"),
        text: values.content,
        logEntriesId: params.id,
        templateId: values.template,
      };

      if (selectedLog) {
        await axios.put(`Log/${selectedLog.id}`, data).then(async (res) => {
          console.log(res);
          toast.success("Log updated successfully");
          setSelectedLog(null);
          await init();
          setModal(false);
        });
      } else {
        await axios.post("Log", data).then(async (res) => {
          console.log(res);
          toast.success("Log created successfully");
          setSelectedLog(null);
          await init();
          setModal(false);
        });
      }

      formik.resetForm();
    },
  });

  useEffect(() => {
    init();
  }, [user]);

  async function init() {
    await axios
      .get(`Log`)
      .then((res) => {
        const logs: ILog[] = res.data.filter(
          (log: ILog) => log.logEntriesId == Number(params.id)
        );

        setDailyLogs(logs);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="p-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Logs #{params.id}</h1>
        <Button onClick={() => setModal(true)}>Create</Button>

        {modal && (
          <ModalFormLog
            setSelectedLog={setSelectedLog}
            selectedLog={selectedLog}
            modal={modal}
            setModal={setModal}
            formik={formik}
          />
        )}
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {dailyLogs.length == 0 && <p>No logs found</p>}
        {dailyLogs.map((log) => (
          <LogItem
            key={log.id}
            log={log}
            setModal={setModal}
            setSelectedLog={setSelectedLog}
            init={init}
          />
        ))}
      </div>
    </div>
  );
}
