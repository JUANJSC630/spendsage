import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FromTransaction } from "./components/FormTransaction";

export default function FinancesPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-background text-primary-foreground py-4 px-6">
        <div className="container mx-auto flex items-center justify-end">
          <div className="flex items-center gap-4 ">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900">June 2023</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex-1 py-8 md:px-6">
        <div className="container mx-auto grid gap-8">
          <div className="grid md:grid-cols-2 gap-8 md:p-4">
            <div className="border border-slate-100 p-4 rounded-md hover:bg-indigo-50 transition-colors duration-300 ease-in">
              <FromTransaction />
            </div>
            <div className="border border-slate-100 p-4 rounded-md hover:bg-emerald-50 transition-colors duration-300 ease-in">
              <h2 className="text-2xl font-bold mb-4">Recent transactions</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Income</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-4xl font-bold">
                $6,700.00
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-4xl font-bold">
                $2,780.00
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Balance</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-4xl font-bold">
                $3,920.00
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
