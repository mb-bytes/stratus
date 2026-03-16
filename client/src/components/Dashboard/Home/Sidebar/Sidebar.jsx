import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./SideProvider";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
  IconChartAreaLine,
  IconNote,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../../../../libs/utils";
import { useAuth } from "../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import {Link, NavLink} from 'react-router-dom'

export function SidebarDemo({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/jobs",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: (
        <IconChartAreaLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Notes",
      href: '/notes',
      icon: (
        <IconNote className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const logoutLink = {
    label: "Logout",
    icon: (
      <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  };

  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setOpen(false);
    const id = sileo.warning({
      title: "Sign out",
      description: "Are you sure you want to sign out?",
      fill: "black",
      styles: {
        title: "text-white text-lg!",
        description: "text-white/75 text-md text-center!",
      },
      duration: 6000,
      button: {
        title: "Yes, sign out",
        onClick: async () => {
          sileo.dismiss(id);
          await logout();
          navigate("/login");
        },
      },
    });  
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
      <div className="flex h-full w-full flex-col md:flex-row">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                <SidebarLink link={logoutLink} onClick={handleLogout} />
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: currentUser?.name || "User",
                  href: "#",
                  icon: (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "U")}&background=random`}
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar" />
                  ),
                }} />
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex flex-1 min-w-0 min-h-0 flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      to="/jobs"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <img src="/assets/onlyLogo.png"
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm"/>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-2xl whitespace-pre text-black dark:text-white">
        stratus
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <img src="/assets/onlyLogo.png"
        className="h-4 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm" />
    </Link>
  );
};

