import { MessageManagement } from "@/components/message-management";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  return <MessageManagement />;
}
