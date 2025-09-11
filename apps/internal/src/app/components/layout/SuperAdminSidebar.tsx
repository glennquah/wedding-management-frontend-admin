"use client";
import { CheckSquare, ListTodo, Timer} from "lucide-react";
import AppSidebar from "@shared/components/AppSidebar"


const tabs = [
    {
        sectionHeader: "Management",
        items: [
            {
                title: "Admin Management",
                href: "/admin-management",
                icon: Timer,
            },
            {
                title: "Vendor Management",
                href: "/vendor-management",
                icon: CheckSquare,
            },
            {
                title: "Guest Management",
                href: "/guest-management",
                icon: ListTodo,
            },
        ]
    },
    {
        sectionHeader: "Analytics",
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: Timer,
            },
            {
                title: "Reports",
                href: "/reports",
                icon: CheckSquare,
            }
        ]
    }
];


export default function SuperAdminSidebar() {
  return (
    <AppSidebar tabs={tabs} />
  );
}
