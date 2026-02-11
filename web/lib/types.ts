export type RouteRecordInput = {
  departureDate: string;
  returnDate: string;
  route: string;
  dieselExpense: number;
  oilExpense: number;
  rationFoodExpense: number;
  mobileExpense: number;
  miscExpense: number;
  driverSalary: number;
  garageExpense: number;
  serviceExpense: number;
  income1: number;
  income2: number;
  income3: number;
  income4: number;
  additionalExpenseDetail?: string;
  additionalExpenseAmount: number;
};

export type RouteRecord = RouteRecordInput & {
  id: string;
  businessId: string;
  tripDays: number;
  totalExpenses: number;
  totalIncome: number;
  profit: number;
  loss: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type MonthlySummaryItem = {
  year: number;
  monthNo: number;
  monthName: string;
  trips: number;
  totalExpenses: number;
  totalIncome: number;
  additionalExpenses: number;
  profit: number;
  loss: number;
};

export type YearlySummaryItem = {
  year: number;
  trips: number;
  totalExpenses: number;
  totalIncome: number;
  additionalExpenses: number;
  profit: number;
  loss: number;
};

export type DashboardKpis = {
  totalTrips: number;
  totalIncome: number;
  totalExpenses: number;
  totalProfit: number;
  totalLoss: number;
  netResult: number;
};
