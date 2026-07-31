import { useAgentStore } from "@/store/agentStore"

export const useIsAuth = () => {
    const isAuth = useAgentStore((state) => state.access_token)
    return isAuth ? true : false
}