"use client";
import React from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // ไม่ต้องการให้เปลี่ยนเส้นทางอัตโนมัติ
    router.push("/"); // เปลี่ยนเส้นทางไปยังหน้าแรกหลังจากออกจากระบบ
  };

  return (
    <div>
      <nav
        id="nav"
        className="text-white p-2 flex"
        style={{ overflow: "hidden" }}
      >
        <div>
          <Image
            src="/logo-mfu.png"
            width={60}
            height={60}
            alt="MFU-LOGO"
            priority
          />
        </div>
        <div className="container flex items-center">
          <div className="h-[3.5rem] w-[0.1rem] ml-2" id="line"></div>
          <div className="flex flex-col items-center ml-2">
            <h1 id="NameUni" className="font-bold">
              Mae Fah Luang University
            </h1>
            <div
              className="h-[0.1rem] w-[14rem] justify-center my-1"
              id="line"
            ></div>
            <h1 id="NameUni" className="font-bold">
              มหาวิทยาลัยแม่ฟ้าหลวง
            </h1>
          </div>
        </div>
        {/* แสดงปุ่ม Sign Out เฉพาะเมื่อมีการเข้าสู่ระบบ */}
        {session && (
          <button
            onClick={handleSignOut}
            className="ml-auto bg-red-600 text-white text-sm py-1 px-4 rounded-lg"
          >
            Sign Out
          </button>
        )}
      </nav>
      <div className="h-2" id="line-under"></div>
    </div>
  );
}

export default Navbar;
