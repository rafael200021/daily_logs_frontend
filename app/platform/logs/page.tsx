"use client";
import React, { useEffect, useState } from "react";
import { Divider, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import useAxios from "@/hooks/useAxios";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom/userState";
import { ILogEntry } from "@/interfaces/ILogEntry";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const axios = useAxios();
  const user = useRecoilValue(userState);
  const [modal, setModal] = useState(false);
  const [logs, setLogs] = useState<ILogEntry[]>([]);
  const navigate = useRouter();

  const columns: TableColumnsType<ILogEntry> = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Logs",
      dataIndex: "logs",
      render: (logs: []) => logs.length,
    },

    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => format(new Date(date), "MM/dd/yyyy"),
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Ações",
      dataIndex: "actions",
      render: (_, record) => (
        <span>
          <a onClick={() => handleDetail(record)}>Details</a>
          <Divider type="vertical" />
          <a onClick={() => handleDelete(record)}>Delete</a>
        </span>
      ),
    },
  ];

  const onChange: TableProps<ILogEntry>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const formik = useFormik<{
    date: Date | undefined;
  }>({
    initialValues: {
      date: undefined,
    },
    onSubmit: async (values: { date: Date | undefined }) => {
      const data = {
        userId: user?.id,
        date: values.date,
      };

      await axios.post("LogEntry", data).then(async (res) => {
        console.log(res);
        setModal(false);
        toast.success("Log created successfully");
        await init();
      });
    },
  });

  function handleDetail(record: ILogEntry): void {
    navigate.push(`/platform/logs/${record.id}`);
  }

  function handleDelete(record: ILogEntry): void {
    axios.delete(`LogEntry/${record.id}`).then(async (res) => {
      console.log(res);
      toast.success("Log deleted successfully");
      await init();
    });
  }

  useEffect(() => {
    init();
  }, [user]);

  async function init() {
    await axios.get("LogEntry").then((res) => {
      let log: ILogEntry[] = res.data;

      log = log.filter((log: ILogEntry) => {
        return log.userId == user?.id;
      });

      log = log.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setLogs(log);
    });
  }

  return (
    <div className="p-20 ">
      <div className="flex items-center mb-10 justify-between">
        <h1 className="font-bold text-3xl">Daily Logs</h1>
        <Dialog open={modal} onOpenChange={setModal}>
          <DialogTrigger asChild>
            <Button onClick={() => setModal(true)}>Create</Button>
          </DialogTrigger>
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
                  <Label htmlFor="name" className="font-bold text-sm">
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !formik.values.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formik.values.date ? (
                          format(formik.values.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formik.values.date}
                        onSelect={(value) =>
                          formik.setFieldValue("date", value)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table<ILogEntry>
        rowKey="id"
        columns={columns}
        dataSource={logs}
        onChange={onChange}
      />
    </div>
  );
}
