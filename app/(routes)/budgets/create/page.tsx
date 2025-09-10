import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetForm } from '../components/BudgetForm/BudgetForm';

export default function CreateBudgetPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/budgets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PlusCircle className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Crear Presupuesto</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nuevo Presupuesto</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetForm />
        </CardContent>
      </Card>
    </div>
  );
}