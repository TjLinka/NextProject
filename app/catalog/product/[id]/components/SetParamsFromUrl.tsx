'use client'

import { useParamsForReg } from "@/store/paramsForReg";

export const SetParamsFromUrl = ({aid, t} : {aid: string, t: string}) => {
    const setParams = useParamsForReg((state) => state.setParams)
    setParams({aid, t})
    return null
};