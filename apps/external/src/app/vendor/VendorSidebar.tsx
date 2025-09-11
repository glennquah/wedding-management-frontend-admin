"use client";

import { LayoutDashboard, CircleDollarSign, Users, FileSpreadsheet, CalendarDays } from "lucide-react";
import AppSidebar from "@shared/components/AppSidebar";

const tabs = [
    {
        sectionHeader: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/vendor/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Revenue",
                href: "/vendor/revenue",
                icon: CircleDollarSign,
            }
        ]
    },
    {
        sectionHeader: "Management",
        items: [
            {
                title: "Customers",
                href: "/vendor/customers",
                icon: Users,
            },
            {
                title: "Services",
                href: "/vendor/services",
                icon: FileSpreadsheet,
            },
            {
                title: "Calendar",
                href: "/vendor/calendar",
                icon: CalendarDays,
            }
        ]
    }
];

export default function VendorSidebar() {
    return (
        <AppSidebar tabs={tabs} />
  );
}
