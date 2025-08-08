import React from "react";
import Header from "@/components/organisms/Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;