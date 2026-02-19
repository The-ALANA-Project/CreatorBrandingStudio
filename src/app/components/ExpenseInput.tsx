import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export interface Expense {
  id: string;
  category: string;
  monthlyCost: number;
}

interface ExpenseInputProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
}

export function ExpenseInput({ expenses, onExpensesChange }: ExpenseInputProps) {
  const addExpense = () => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      category: "",
      monthlyCost: 0,
    };
    onExpensesChange([...expenses, newExpense]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    onExpensesChange(
      expenses.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const deleteExpense = (id: string) => {
    onExpensesChange(expenses.filter((exp) => exp.id !== id));
  };

  const totalMonthly = expenses.reduce((sum, exp) => sum + (exp.monthlyCost || 0), 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Monthly Expenses</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Add all your monthly costs: housing, food, health, software, tools, equipment, etc. <strong>When filling these bare number fields think in your own native currency.</strong> (USD, EUR, GBP, etc.).
        </p>
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex gap-2 items-end">
            {/* Category */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <Label htmlFor={`category-${expense.id}`} className="text-xs sm:text-sm">
                Category
              </Label>
              <Input
                id={`category-${expense.id}`}
                placeholder="Category"
                value={expense.category}
                onChange={(e) => updateExpense(expense.id, "category", e.target.value)}
                className="bg-input-background border border-border h-9 text-sm"
              />
            </div>
            
            {/* Monthly Cost */}
            <div className="w-24 sm:w-32 space-y-1.5">
              <Label htmlFor={`cost-${expense.id}`} className="text-xs sm:text-sm">
                Cost
              </Label>
              <Input
                id={`cost-${expense.id}`}
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={expense.monthlyCost || ""}
                onChange={(e) =>
                  updateExpense(expense.id, "monthlyCost", parseFloat(e.target.value) || 0)
                }
                className="bg-input-background border border-border h-9 text-sm"
              />
            </div>
            
            {/* Trash Icon */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => deleteExpense(expense.id)}
              className="h-9 w-9 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addExpense}
        className="w-full border-border"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Expense
      </Button>

      <div className="backdrop-blur-2xl bg-primary border border-primary/20 rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-4 sm:p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-[#FEE6EA]">Total Monthly Expenses</span>
          <span className="font-medium text-sm sm:text-base text-primary-foreground">{totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-[#FEE6EA]">Total Annual Expenses</span>
          <span className="font-medium text-sm sm:text-base text-primary-foreground">{totalAnnual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}