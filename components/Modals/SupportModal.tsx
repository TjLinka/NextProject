import { useEffect, useState } from "react";
import { Button } from "../UI/Button";
import * as motion from "motion/react-client";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDialog,
  createMessage,
  getDialogMessages,
  getDialogs,
} from "@/dbQuery/dbQuerys";
import clsx from "clsx";
import { useAgentStore } from "@/store/agentStore";
import Image from "next/image";

export type Chat = {
  id: number | string | null;
  title: string;
};

export const SupportModal = () => {
  const [selectedTitleName, setSelectedTitleNames] = useState<string | null>(
    null,
  );
  const [isChatAddOpen, setIsChatAddOpen] = useState<boolean>(false);
  const [selectedDialog, setselectedDialog] = useState<number | string | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState<string>("");
  const user = useAgentStore((state) => state.id);

  const qc = useQueryClient();

  // const { data: titles = [] } = useQuery({
  //   queryKey: ["dialog_titles"],
  //   queryFn: async () => {
  //     const res = await fetch("/api/support/titles");
  //     const data = await res.json();
  //     return data.title_id;
  //   },
  //   staleTime: 0,
  // });
  const { data: dialogs = [], isLoading: loadingDialogs } = useQuery<Chat[]>({
    queryKey: ["dialogs_list"],
    queryFn: async () => {
      const res = await getDialogs();

      return res as Chat[];
    },
    staleTime: 0,
  });
  const { data: dialogMessages = [] } = useQuery({
    queryKey: ["dialog_messages", selectedDialog],
    queryFn: async () => {
      const res = await fetch(
        `/api/dialogs/messages?dialog_id=${selectedDialog}&recieverId=0`,
      );
      console.log(await res.json());

      // return res as { message_id: number; text: string; sender_name: string }[];
    },
    staleTime: 0,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await createDialog(selectedTitleName, selectedTitleName, 0);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dialogs_list"] });
      setIsChatAddOpen(false);
    },
  });
  const mutation2 = useMutation({
    mutationFn: async () => {
      await createMessage(newMessage, 9);
    },
    onSuccess: () => {
      setNewMessage("");
      qc.invalidateQueries({ queryKey: ["dialog_messages"] });
    },
    onError: (error) => {
      const errors = JSON.parse(error.message);
    },
  });

  if (selectedDialog) {
    return (
      <div className="text-black">
        <Button onClick={() => setselectedDialog(null)}>Назад</Button>
        <p className="text-2xl border-b-2 border-(--main-color) w-fit mt-4">
          Диалог {selectedDialog}
        </p>
        <div className="flex flex-col gap-5 mt-5 bg-[#8080801c] rounded-lg p-4 overflow-y-auto h-[30vh] shadow">
          {dialogMessages.map((m) => {
            return (
              <p
                key={m.message_id}
                className={clsx("p-4 max-w-1/2 bg-white rounded-lg shadow", {
                  "self-end": m.sender_id !== user,
                  "self-start": m.sender_id === user,
                })}
              >
                {m.sender_name}
              </p>
            );
          })}
        </div>
        <div className="flex gap-2 items-center mt-5">
          <textarea
            value={newMessage}
            className="w-full resize-none rounded-lg h-30 bg-[#8080801c] p-2  outline-none shadow"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewMessage(e.currentTarget.value)
            }
          ></textarea>
          <Image
            alt="Send Message Icon"
            src={`/icons/SendMessage.svg`}
            width={200}
            height={200}
            onClick={() => mutation2.mutate()}
            className="w-20 h-10 cursor-pointer"
          />
        </div>
      </div>
    );
  }
  if (!isChatAddOpen) {
    return (
      <div className="text-black">
        <p className="text-2xl border-b-2 border-(--main-color) w-fit">
          Список диалогов
        </p>
        <div className="flex flex-col gap-2 mt-5 p-2 shadow bg-(--body-color) rounded">
          {loadingDialogs ? (
            <div className="flex flex-col gap-5 ">
              <Skeleton width="100%" className="h-10!"></Skeleton>
              <Skeleton width="100%" className="h-10!"></Skeleton>
              <Skeleton width="100%" className="h-10!"></Skeleton>
            </div>
          ) : (
            <div className="max-h-[30vh] overflow-y-auto flex flex-col gap-3 pr-2 py-1">
              {dialogs.map((t) => {
                return (
                  <motion.div
                    onClick={() => setselectedDialog(t.id)}
                    whileTap={{ scale: 0.99 }}
                    key={t.id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow cursor-pointer"
                  >
                    <div className="">
                      <span className="text-lg">{t.title}</span>
                    </div>
                    <Image
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      alt="Delete Icon"
                      src={"/icons/Delete.svg"}
                      width={200}
                      height={200}
                      className="w-7 h-7"
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-5">
          <Button onClick={() => setIsChatAddOpen(true)}>Создать диалог</Button>
        </div>
      </div>
    );
  }
  if (isChatAddOpen) {
    return (
      <div className="flex justify-between gap-5 items-center">
        <Dropdown
          value={selectedTitleName}
          showClear
          optionValue="text"
          virtualScrollerOptions={{ itemSize: 38 }}
          onChange={(e) => setSelectedTitleNames(e.value)}
          options={titles}
          optionLabel="text"
          placeholder="Выберите тему диалога"
          className="w-2/3 md:w-14rem"
        />
        <Button className="w-1/3 h-10" onClick={() => mutation.mutate()}>
          Создать диалог
        </Button>
      </div>
    );
  }
};
