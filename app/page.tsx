import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <div className="mt-[2rem]">
        <Navbar />
      </div>
      <main className="max-w-6xl mx-auto mt-[6rem] p-4">
        <Hero />
      </main>
    </div>
  );
}
