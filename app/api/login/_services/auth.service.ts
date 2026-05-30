import { serverFetch } from "@/lib/auth";


export default async function LoginHandler(login: string, password: string) {
  const response = await serverFetch(`/api/partner/Agent/login`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
  return response;
}
