import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AgetState {
    readonly id: string | number
    access_token: string
}

export const useAgentStore = create()(
    persist(
        (set) => ({
            agentInfo: null,
            setAgentInfo: (data: any) =>
                set(() => ({
                    agentInfo: data
                }))
        }),
        {
            name: 'agent-storage',
        },
    ),
)