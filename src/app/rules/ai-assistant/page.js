import react from "react";
import Sidebar from "../components/sidebar";


const page = () => {
    return (
        <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full max-w-64 bg-gray-900 text-white overflow-y-auto">
          <Sidebar />
        </div>
  
        {/* Main Content */}
        <div className="ml-64 flex-1 flex flex-col h-full">
  
        </div>
      </div>    )
}


export default page;