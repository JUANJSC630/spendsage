import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="bg-background py-4 px-6">
      <div className="container mx-auto flex items-center gap-8">
        <div>
          <Link href="/finances">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
              <span className="text-gray-700">Finances</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
