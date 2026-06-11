'use client'

import { Button } from "@/components/UI/Button";
import { useRouter } from "next/navigation";

export const BackButton = () => {
    const router = useRouter();
    const handleBack = () => {
        router.back()
    };
    return <Button onClick={handleBack}>Вернуться в каталог</Button>;
};