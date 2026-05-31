'use client'

import { User } from "@/types/user/types"
import clsx from "clsx"
import Image from "next/image"
import { InputText } from "primereact/inputtext"
import { useEffect, useState } from "react"

export default function CartCheckoutPage() {
    const [userInfo, setUserInfo] = useState<User>()
    const [deliverySystems, setDeliverySystems] = useState<{ id: number, name: string }[]>([])
    const [selectedDeliverySystem, setSelectedDeliverySystem] = useState<number | null>(null)
    useEffect(() => {
        async function getUserData() {
            const res = await fetch('/api/user/me')
            const data = await res.json()
            setUserInfo(data)
        }
        async function getDelSystems() {
            const res = await fetch('/api/cart/del-systems')
            const data = await res.json()
            data.shift()
            setDeliverySystems(data)
        }
        getUserData()
        getDelSystems()
    }, [])

    const handleSelectDeliverySystem = (id: number) => {
        setSelectedDeliverySystem(id)
    }

    return <>
        <span className="text-2xl font-semibold pb-1 border-b-2 border-[#bf94ff]">Данные покупателя</span>
        <div className="grid grid-cols-3 gap-5 mt-5">
            <div className="w-full">
                <p className="font-semibold">Ф.И.О.</p>
                <InputText value={userInfo?.fullname} onInput={(e) => {
                    setUserInfo({...userInfo, fullname: e.value})
                }} className="w-full" />
            </div>
            <div className="w-full">
                <p className="font-semibold">Телефон</p>
                <InputText value={userInfo?.mobile_phone} onInput={(e) => {
                    setUserInfo({...userInfo, mobile_phone: e.value})
                }} className="w-full" />
            </div>
            <div className="w-full">
                <p className="font-semibold">E-mail (необязательно)</p>
                <InputText value={userInfo?.email} onInput={(e) => {
                    setUserInfo({...userInfo, email: e.value})
                }} className="w-full" />
            </div>
        </div>
        <div className="w-fit text-2xl font-semibold pb-1 border-b-2 border-[#bf94ff] mt-10">Способ доставки</div>
        <div className="grid grid-cols-4 gap-5 mt-5">
            {deliverySystems.map((d) => {
                return <div key={d.id} onClick={() => setSelectedDeliverySystem(d.id)} className={clsx("bg-white p-2 h-[80px] capitalize transition-[background] duration-150 ease-in-out rounded shadow text-center text-xl font-semibold flex justify-center items-center  cursor-pointer", {
                    'bg-[#bf94ff]! text-white': selectedDeliverySystem === d.id
                })}>
                    <img src={`/imgs/${d.name}.png`} width={200} height={100} alt="Del System Img" className="h-full w-full"/>
                </div>
            })}
        </div>
        {selectedDeliverySystem !== null && selectedDeliverySystem === 0 ?
            <div className="text-xl font-semibold mt-5">
                Адрес для самовывоза: г. Пермь, ул. Ветлужская, 3
            </div> : 
            <div>

            </div>
            }
    </>
}