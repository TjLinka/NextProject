import { useEffect, useState } from "react";
import { Button } from "../UI/Button";
import { Dropdown } from "primereact/dropdown";
import { createDialog } from "@/lib/actions";
import { Skeleton } from "primereact/skeleton";

export const SupportModal = () => {
  const [chatTitles, setChatTitles] = useState([]);
  const [selectedTitleName, setSelectedTitleNames] = useState<string | null>(
    null,
  );
  const [dialogsList, setDialogsList] = useState([]);
  const [isChatAddOpen, setIsChatAddOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getTtitle() {
      const res = await fetch("/api/support/titles");
      const data = await res.json();
      setChatTitles(data.title_id);
    }
    async function getDialogs() {
      const res = await fetch("/api/support/dialogs", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);

      setDialogsList(data);
    }
    getTtitle();
    getDialogs();
  }, []);

  const handleCreateDialog = async () => {
    await createDialog({
      name: selectedTitleName,
      title: selectedTitleName,
      sender: 105,
      reciever: 0,
    });
    const res = await fetch("/api/support/titles");
    const data = await res.json();
    setChatTitles(data.title_id);
    setIsChatAddOpen(false);
  };
  <Skeleton width="50%" className="mb-2 w-1/2"></Skeleton>;
  if (!isChatAddOpen) {
    return (
      <div className="text-black">
        <p className="text-2xl border-b-2 border-(--main-color) w-fit">
          Список диалогов
        </p>
        <div className="flex flex-col gap-2 mt-5">
          {dialogsList.length <= 0 ? (
            <div className="flex flex-col gap-5 ">
              <Skeleton width="100%" className="h-10!"></Skeleton>
              <Skeleton width="100%" className="h-10!"></Skeleton>
              <Skeleton width="100%" className="h-10!"></Skeleton>
            </div>
          ) : (
            <>
              {dialogsList.map((t) => {
                return (
                  <div
                    key={t.id}
                    className="p-4 bg-[#8080801c] rounded-lg shadow"
                  >
                    <span className="text-lg font-semibold">{t.title}</span>
                  </div>
                );
              })}
            </>
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
          options={chatTitles}
          optionLabel="text"
          placeholder="Выберите тему диалога"
          className="w-2/3 md:w-14rem"
        />
        <Button className="w-1/3 h-10" onClick={handleCreateDialog}>
          Создать диалог
        </Button>
      </div>
    );
  }
};
