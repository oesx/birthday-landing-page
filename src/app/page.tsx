import { MessageWall } from "@/components/message-wall";
import { HomePage } from "@/components/home-page";

export default function Home() {
  return (
    <main>
      <section className="h-screen">
        <HomePage />
      </section>
      <section>
        <MessageWall />
      </section>
    </main>
  );
}
