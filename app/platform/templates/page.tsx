"use client";
import React, { useEffect, useState } from "react";
import { Divider, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";

import useAxios from "@/hooks/useAxios";
import { useFormik } from "formik";
import { useRecoilValue } from "recoil";
import { userState } from "@/atom/userState";
import { ITemplate } from "@/interfaces/ITemplate";
import ModalFormTemplate from "./components/ModalFormTemplate";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Page() {
  const axios = useAxios();
  const user = useRecoilValue(userState);
  const [modal, setModal] = useState(false);
  const [logs, setLogs] = useState<ITemplate[]>([]);
  const [template, setTemplate] = useState<undefined | ITemplate>();

  const columns: TableColumnsType<ITemplate> = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },

    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <span>
          <a onClick={() => handleEdit(record)}>Edit</a>
          <Divider type="vertical" />
          <a onClick={() => handleDelete(record)}>Delete</a>
        </span>
      ),
    },
  ];

  const onChange: TableProps<ITemplate>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const formik = useFormik<{
    name: string;
    content: string;
  }>({
    initialValues: {
      name: "",
      content: "",
    },
    onSubmit: async (values) => {
      const data = {
        userId: user?.id,
        name: values.name,
        text: values.content,
      };

      if (template) {
        await axios.put(`Template/${template.id}`, data).then(async (res) => {
          console.log(res);
          setModal(false);
          setTemplate(undefined);

          toast.success("Template updated successfully");
          await init();
        });
      } else {
        await axios.post("Template", data).then(async (res) => {
          console.log(res);
          setTemplate(undefined);
          setModal(false);
          toast.success("Template created successfully");
          await init();
        });
      }

      formik.resetForm();

    },
  });

  function handleDelete(record: ITemplate): void {
    axios.delete(`Template/${record.id}`).then(async (res) => {
      console.log(res);
      toast.success("Template deleted successfully");
      await init();
    });
  }

  function handleEdit(record: ITemplate): void {
    setTemplate(record);
    setModal(true);
  }

  useEffect(() => {
    init();
  }, [user]);

  async function init() {
    await axios.get("Template").then((res) => {
      let templates: ITemplate[] = res.data;

      templates = templates.filter((template) => template.userId == user?.id);

      setLogs(templates);
    });
  }

  return (
    <div className="p-20 ">
      <div className="flex items-center mb-10 justify-between">
        <h1 className="font-bold text-3xl">Templates</h1>
        <Button onClick={() => setModal(true)}>Create</Button>

        {modal && (
          <ModalFormTemplate
            modal={modal}
            setTemplate={setTemplate}
            setModal={setModal}
            formik={formik}
            template={template}
          />
        )}
      </div>
      <Table<ITemplate>
        columns={columns}
        dataSource={logs}
        onChange={onChange}
        rowKey="id"
      />
    </div>
  );
}
