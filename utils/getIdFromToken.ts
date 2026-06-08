import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const getIdFromToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let id = null;

  if (token) {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode("MiQagu7qGi6FP5ieNK9xEnyNObBqiCEmzDt4mhSh"),
      {
        clockTolerance: 99999999, // игнорирует истёкший токен
      },
    );
    const nameId =
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
    id = Array.isArray(nameId) ? nameId[0] : nameId;
  }
  return Number(id);
};
