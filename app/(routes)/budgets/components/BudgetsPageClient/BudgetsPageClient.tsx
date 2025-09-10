"use client";

import { useState, useEffect } from "react";
import { PlusCircle, AlertCircle, Clock, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";
import useFormatAmount from "@/hooks/useFormatAmount";
import { Progress } from "@/components/ui/progress";
import { format, isAfter, isBefore, addDays } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Utility function for formatting amounts - will be replaced by hook

// Interfaces
interface BudgetAlert {
  id: string;
  title: string;
  description: string;
  variant: "default" | "destructive";
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  spent: number;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

interface BudgetsPageClientProps {
  budgets: Budget[];
  totalBudget: number;
  totalSpent: number;
  alerts: BudgetAlert[];
}

// Budget Dashboard Component
const BudgetDashboard = ({ totalBudget, totalSpent, budgets }: { totalBudget: number; totalSpent: number; budgets: Budget[] }) => {
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>("");
  const formatAmount = useFormatAmount();

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);
  const percentage = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const remaining = totalBudget - totalSpent;
  const isOverBudget = totalSpent > totalBudget;
  
  // Calculate statistics with safety checks
  const safeBudgets = budgets || [];
  const activeBudgets = safeBudgets.filter(b => !isAfter(new Date(), b.endDate));
  const expiredBudgets = safeBudgets.filter(b => isAfter(new Date(), b.endDate));
  const overBudgets = safeBudgets.filter(b => b.spent > b.amount);
  
  return (
    <Card className="p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Resumen de Presupuestos</h2>
        <p className="text-muted-foreground">Seguimiento general de tus finanzas</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Total Presupuestado</p>
          <p className="text-lg font-bold text-blue-700">{symbol}{formatAmount(totalBudget.toString())}</p>
        </div>
        <div className={`text-center p-3 rounded-lg ${isOverBudget ? 'bg-red-50' : 'bg-gray-50'}`}>
          <p className={`text-sm mb-1 ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>Total Gastado</p>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-red-700' : 'text-gray-700'}`}>{symbol}{formatAmount(totalSpent.toString())}</p>
        </div>
        <div className={`text-center p-3 rounded-lg ${isOverBudget ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className={`text-sm mb-1 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {isOverBudget ? 'Exceso' : 'Disponible'}
          </p>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-red-700' : 'text-green-700'}`}>
            {symbol}{formatAmount(Math.abs(remaining).toString())}
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Progreso</p>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-red-700' : 'text-purple-700'}`}>{percentage}%</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progreso General</span>
          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : ''}`}>{percentage}%</span>
        </div>
        <Progress 
          value={Math.min(percentage, 100)} 
          className={`h-3 ${isOverBudget ? 'bg-red-200' : ''}`} 
        />
        {isOverBudget && (
          <p className="text-xs text-red-600 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Has excedido tu presupuesto total por {symbol}{formatAmount((totalSpent - totalBudget).toString())}
          </p>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{activeBudgets.length}</p>
          <p className="text-xs text-muted-foreground">Activos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{overBudgets.length}</p>
          <p className="text-xs text-muted-foreground">Excedidos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-500">{expiredBudgets.length}</p>
          <p className="text-xs text-muted-foreground">Vencidos</p>
        </div>
      </div>
    </Card>
  );
};

// Budget Alerts Component
const BudgetAlerts = ({ alerts, budgets }: { alerts: BudgetAlert[]; budgets: Budget[] }) => {
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>("");
  const formatAmount = useFormatAmount();

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);
  const currentDate = new Date();
  
  // Categorize budgets with safety checks
  const safeBudgets = budgets || [];
  const safeAlerts = alerts || [];
  const expiredBudgets = safeBudgets.filter(budget => isAfter(currentDate, budget.endDate));
  const nearExpiredBudgets = safeBudgets.filter(budget => 
    !isAfter(currentDate, budget.endDate) && 
    isBefore(budget.endDate, addDays(currentDate, 7))
  );
  const overBudgets = safeBudgets.filter(budget => budget.spent > budget.amount);
  const nearLimitBudgets = safeBudgets.filter(budget => 
    budget.spent > budget.amount * 0.8 && 
    budget.spent <= budget.amount
  );

  const hasAnyAlerts = safeAlerts.length > 0 || expiredBudgets.length > 0 || 
                      nearExpiredBudgets.length > 0 || overBudgets.length > 0 || 
                      nearLimitBudgets.length > 0;

  if (!hasAnyAlerts) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-green-700 mb-1">¡Todo bajo control!</h3>
          <p className="text-sm text-muted-foreground">
            Tus presupuestos están en buen estado
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <AlertCircle className="text-yellow-500 mr-2" />
        <h2 className="text-xl font-bold">Panel de Alertas</h2>
      </div>
      
      <div className="space-y-3">
        {/* Presupuestos Vencidos */}
        {expiredBudgets.length > 0 && (
          <Card className="p-4 border-l-4 border-l-red-600 bg-red-50">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Presupuestos Vencidos</h3>
                <p className="text-sm text-red-700 mb-2">
                  {expiredBudgets.length} presupuesto(s) han vencido
                </p>
                <div className="space-y-1">
                  {expiredBudgets.slice(0, 2).map((budget) => (
                    <div key={budget.id} className="text-xs bg-white p-2 rounded border border-red-200">
                      <span className="font-medium">{budget.name}</span>
                      <span className="text-red-600 ml-2">
                        Venció el {format(budget.endDate, 'dd/MM/yyyy')}
                      </span>
                    </div>
                  ))}
                  {expiredBudgets.length > 2 && (
                    <p className="text-xs text-red-600">
                      +{expiredBudgets.length - 2} más...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Presupuestos Próximos a Vencer */}
        {nearExpiredBudgets.length > 0 && (
          <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Próximos a Vencer</h3>
                <p className="text-sm text-orange-700 mb-2">
                  {nearExpiredBudgets.length} presupuesto(s) vencen esta semana
                </p>
                <div className="space-y-1">
                  {nearExpiredBudgets.slice(0, 2).map((budget) => (
                    <div key={budget.id} className="text-xs bg-white p-2 rounded border border-orange-200">
                      <span className="font-medium">{budget.name}</span>
                      <span className="text-orange-600 ml-2">
                        Vence el {format(budget.endDate, 'dd/MM/yyyy')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Presupuestos Excedidos */}
        {overBudgets.length > 0 && (
          <Card className="p-4 border-l-4 border-l-red-500 bg-red-50">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Presupuestos Excedidos</h3>
                <p className="text-sm text-red-700 mb-2">
                  {overBudgets.length} presupuesto(s) han superado el límite
                </p>
                <div className="space-y-1">
                  {overBudgets.slice(0, 2).map((budget) => {
                    const excess = budget.spent - budget.amount;
                    const percentage = Math.round((budget.spent / budget.amount) * 100);
                    return (
                      <div key={budget.id} className="text-xs bg-white p-2 rounded border border-red-200">
                        <span className="font-medium">{budget.name}</span>
                        <div className="text-red-600">
                          Exceso: {symbol}{formatAmount(excess.toString())} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Presupuestos Cerca del Límite */}
        {nearLimitBudgets.length > 0 && (
          <Card className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">Cerca del Límite</h3>
                <p className="text-sm text-yellow-700 mb-2">
                  {nearLimitBudgets.length} presupuesto(s) están cerca del límite
                </p>
                <div className="space-y-1">
                  {nearLimitBudgets.slice(0, 2).map((budget) => {
                    const percentage = Math.round((budget.spent / budget.amount) * 100);
                    const remaining = budget.amount - budget.spent;
                    return (
                      <div key={budget.id} className="text-xs bg-white p-2 rounded border border-yellow-200">
                        <span className="font-medium">{budget.name}</span>
                        <div className="text-yellow-600">
                          {percentage}% usado - Quedan {symbol}{formatAmount(remaining.toString())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Alertas Adicionales */}
        {safeAlerts.map((alert) => (
          <Card key={alert.id} className={`p-4 border-l-4 ${alert.variant === 'destructive' ? 'border-l-red-500' : 'border-l-yellow-400'}`}>
            <h3 className="font-semibold">{alert.title}</h3>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Budget List Component
const BudgetList = ({ budgets }: { budgets: Budget[] }) => {
  const { getSymbol } = useCurrencyStore();
  const [symbol, setSymbol] = useState<string>("");
  const formatAmount = useFormatAmount();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSymbol(getSymbol());
  }, [getSymbol]);
  const itemsPerPage = 5;
  
  // Safety checks
  const safeBudgets = budgets || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBudgets = safeBudgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeBudgets.length / itemsPerPage);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Presupuestos</h2>
        <Button asChild>
          <Link href="/budgets/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Presupuesto
          </Link>
        </Button>
      </div>
      
      <div className="space-y-4">
        {currentBudgets.map((budget) => {
          const percentage = budget.amount > 0 ? Math.min(Math.round((budget.spent / budget.amount) * 100), 100) : 0;
          const isOverBudget = budget.spent > budget.amount;
          const isNearLimit = budget.spent > budget.amount * 0.8 && budget.spent <= budget.amount;
          const isExpired = isAfter(new Date(), budget.endDate);
          const isNearExpiry = !isExpired && isBefore(budget.endDate, addDays(new Date(), 7));
          const remaining = budget.amount - budget.spent;
          const daysLeft = Math.max(0, Math.ceil((budget.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
          
          // Card styling based on status
          let cardStyle = "p-4 border transition-all hover:shadow-md";
          if (isExpired) {
            cardStyle += " border-red-200 bg-red-50";
          } else if (isOverBudget) {
            cardStyle += " border-red-300 bg-red-50";
          } else if (isNearLimit || isNearExpiry) {
            cardStyle += " border-yellow-300 bg-yellow-50";
          } else {
            cardStyle += " border-gray-200 hover:border-gray-300";
          }
          
          return (
            <Card key={budget.id} className={cardStyle}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{budget.name}</h3>
                    {isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Vencido
                      </Badge>
                    )}
                    {isNearExpiry && (
                      <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysLeft}d restantes
                      </Badge>
                    )}
                    {isOverBudget && !isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Excedido
                      </Badge>
                    )}
                    {isNearLimit && !isOverBudget && (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Cerca del límite
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(budget.startDate), 'dd/MM/yyyy')} - {format(new Date(budget.endDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                {budget.category && (
                  <Badge style={{ backgroundColor: budget.category.color }} className="text-white">
                    {budget.category.name}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Presupuesto</p>
                  <p className="font-semibold">{symbol}{formatAmount(budget.amount.toString())}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gastado</p>
                  <p className={`font-semibold ${isOverBudget ? 'text-red-500' : ''}`}>
                    {symbol}{formatAmount(budget.spent.toString())}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isOverBudget ? 'Exceso' : 'Disponible'}
                  </p>
                  <p className={`font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
                    {isOverBudget ? 
                      `${symbol}${formatAmount((budget.spent - budget.amount).toString())}` : 
                      `${symbol}${formatAmount(remaining.toString())}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progreso</span>
                  <span className={isOverBudget ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : ''}>{percentage}%</span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? 'bg-red-200' : isNearLimit ? 'bg-yellow-200' : ''}`} 
                />
                
                {/* Status message */}
                {isExpired && (
                  <p className="text-xs text-red-600 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Este presupuesto ha vencido
                  </p>
                )}
                {isNearExpiry && !isExpired && (
                  <p className="text-xs text-orange-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Vence en {daysLeft} día{daysLeft !== 1 ? 's' : ''}
                  </p>
                )}
                {isOverBudget && !isExpired && (
                  <p className="text-xs text-red-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Has superado el presupuesto por {symbol}{formatAmount((budget.spent - budget.amount).toString())}
                  </p>
                )}
                {isNearLimit && !isOverBudget && (
                  <p className="text-xs text-yellow-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Te quedan {symbol}{formatAmount(remaining.toString())} del presupuesto
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center px-3 text-sm">
            Página {currentPage} de {totalPages}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

// Main Client Component
export const BudgetsPageClient = ({ budgets, totalBudget, totalSpent, alerts }: BudgetsPageClientProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BudgetDashboard totalBudget={totalBudget} totalSpent={totalSpent} budgets={budgets} />
        </div>
        <div>
          <BudgetAlerts alerts={alerts} budgets={budgets} />
        </div>
      </div>
      
      <BudgetList budgets={budgets} />
    </div>
  );
};

export default BudgetsPageClient;
