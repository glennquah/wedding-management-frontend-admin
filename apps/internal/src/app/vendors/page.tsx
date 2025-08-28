import { Input } from "@shared/components/Input";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { Button } from "@shared/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@shared/components/ui/card";
import Image from "next/image";

export default function VendorHome() {
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<ResponsiveMenubar />
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<h1 className="text-3xl font-bold text-center sm:text-left">
					Wedding Management - Vendor Portal
				</h1>

				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Vendor Dashboard</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Input placeholder="Search vendors or services..." />
						<div className="grid grid-cols-2 gap-2">
							<Button variant="secondary" size="sm">
								Add Service
							</Button>
							<Button variant="secondary" size="sm">
								View Bookings
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
