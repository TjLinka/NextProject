import { serverFetch } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(Req: NextRequest) {
  const { searchParams } = Req.nextUrl;
  console.log(searchParams.get("dialog_id"));

  const res = await serverFetch(
    `/api/partner/Dialogs/get-dialog-messages?recieverId=0&dialog_id=${searchParams.get("dialog_id")}`,
  );
  // const res = await fetch(
  //   "https://back.grandchef.info/api/partner/Dialogs/get-dialog-messages?recieverId=0&dialog_id=9",
  //   {
  //     headers: {
  //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6WyIxMjAiLCIxMjAiXSwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ItC_0LDRgNGC0L3QtdGAIDEyMCDQn9C-0LLQsNGAISIsImp0aSI6IjNlNDViZjlkLWNiOWYtNDNlYy1hM2QyLTAzZmJhMDEyZDIyZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyLQn9Cw0YDRgtC90LXRgCIsIjAiXSwiZXhwIjoxNzgxMDIxOTI3LCJpc3MiOiJnbGViLnRlYW0iLCJhdWQiOiJnbGViLnRlYW0ifQ.6tCRLbkbE0_79CmFTyNBotfIdbaiRQqqFAPg5eJboBQ`,
  //       access_token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6WyIxMjAiLCIxMjAiXSwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ItC_0LDRgNGC0L3QtdGAIDEyMCDQn9C-0LLQsNGAISIsImp0aSI6IjNlNDViZjlkLWNiOWYtNDNlYy1hM2QyLTAzZmJhMDEyZDIyZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyLQn9Cw0YDRgtC90LXRgCIsIjAiXSwiZXhwIjoxNzgxMDIxOTI3LCJpc3MiOiJnbGViLnRlYW0iLCJhdWQiOiJnbGViLnRlYW0ifQ.6tCRLbkbE0_79CmFTyNBotfIdbaiRQqqFAPg5eJboBQ`,
  //       "Content-Type": "application/json",
  //     },
  //   },
  // );
  return res;
}
