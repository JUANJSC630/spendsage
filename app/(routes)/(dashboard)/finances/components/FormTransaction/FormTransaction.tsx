import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FromTransaction() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Income</h2>
      <form>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"income"}>Income</SelectItem>
                  <SelectItem value={"fixed-expenses"}>
                    Fixed Expenses
                  </SelectItem>
                  <SelectItem value={"variable-expenses"}>
                    Variable Expenses
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="income-date">Date</Label>
              <Input id="income-date" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-description">Description</Label>
            <Input id="income-description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-value">Value</Label>
            <Input id="income-value" type="number" />
          </div>
        </div>
        <Button type="submit" className="mt-4">
          Send
        </Button>
      </form>
    </>
  );
}

export { FromTransaction };
