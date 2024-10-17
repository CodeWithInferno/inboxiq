// pages/index.js (Home.js)
import Navbar from "../app/components/header";
import Banner from "../app/components/Home/Banner";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Navbar />
      <Banner />
    </div>
  );
}
