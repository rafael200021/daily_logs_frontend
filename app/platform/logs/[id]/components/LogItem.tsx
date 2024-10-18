import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { ILog } from "@/interfaces/ILog";
import { TimerIcon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

export default function LogItem({
  log,
  setModal,
  setSelectedLog,
  init,
}: {
  log: ILog;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedLog: React.Dispatch<React.SetStateAction<null | ILog>>;
  init: () => void;
}) {
  const axios = useAxios();
  function deleteLog(id: number) {
    axios.delete(`Log/${id}`).then(() => {
      toast.success("Log deleted successfully");
      init();
    });
  }

  return (
    <div className="border rounded-lg p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{log.title}</h1>
        <div className=" flex items-center gap-4">
          <TimerIcon />
          <p>
            {log.beginTime} - {log.endTime}
          </p>
        </div>
      </div>
      <p className="mt-4 text-justify">{log.text}</p>
      <div className="justify-end gap-2 flex items-center">
        <Button
          onClick={() => {
            setSelectedLog(log);
            setModal(true);
            
          }}
        >
          Edit
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => deleteLog(log.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
