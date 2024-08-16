import { CalendarClockIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import ExpenseIncomeBarChart from "./components/ExpenseIncomeBarChart/ExpenseIncomeBarChart";
import ExpenseIncomeLineChart from "./components/ExpenseIncomeLineChart/ExpenseIncomeLineChart";
import ExpensePieChart from "./components/ExpensePieChart/ExpensePieChart";
import AccountDistributionPieChart from "./components/AccountDistributionPieChart/AccountDistributionPieChart";
import ExpenseRadarChart from "./components/ExpenseRadarChart/ExpenseRadarChart";
import TitleText from "./components/TitleText/TitleText";

export default function dashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
      <div className="w-full flex items-center justify-end gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className=" justify-start text-left font-normal"
            >
              <CalendarClockIcon className="mr-2 h-4 w-4" />
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
              }).format(new Date())}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar initialFocus mode="range" numberOfMonths={1} />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <TitleText />
      </div>
      {/* <div className="grid gap-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardDescription>Checking</CardDescription>
              <CardTitle>$12,345.67</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Rent</div>
                  <div className="text-muted-foreground">-$1,500.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Groceries</div>
                  <div className="text-muted-foreground">-$500.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Utilities</div>
                  <div className="text-muted-foreground">-$200.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Savings</CardDescription>
              <CardTitle>$25,000.00</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Interest</div>
                  <div className="text-muted-foreground">+$50.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Transfer</div>
                  <div className="text-muted-foreground">+$500.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Credit Card</CardDescription>
              <CardTitle>$2,345.67</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Dining</div>
                  <div className="text-muted-foreground">-$150.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Shopping</div>
                  <div className="text-muted-foreground">-$300.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Travel</div>
                  <div className="text-muted-foreground">-$500.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Rent</div>
                  <div className="text-muted-foreground">$1,500.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Groceries</div>
                  <div className="text-muted-foreground">$500.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Utilities</div>
                  <div className="text-muted-foreground">$200.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Transportation</div>
                  <div className="text-muted-foreground">$150.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Entertainment</div>
                  <div className="text-muted-foreground">$300.00</div>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <div>Total Expenses</div>
                  <div>$2,650.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Salary</div>
                  <div className="text-muted-foreground">$5,000.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Freelance</div>
                  <div className="text-muted-foreground">$1,000.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Interest</div>
                  <div className="text-muted-foreground">$50.00</div>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <div>Total Income</div>
                  <div>$6,050.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses and Income</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseIncomeBarChart data={[]} />
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Evolution of Expenses and Revenues Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseRadarChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Evolution of Expenses and Revenues Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseIncomeLineChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensePieChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDistributionPieChart />
            </CardContent>
          </Card>
        </div>
      </div> */}
    </div>
  );
}
