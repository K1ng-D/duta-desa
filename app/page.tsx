import Footer from "@/components/footer";
import HomeData from "@/components/HomeData";
import HomeView from "@/components/HomeView";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HomeView />
      <HomeData />
      <Footer />
    </div>
  );
}
