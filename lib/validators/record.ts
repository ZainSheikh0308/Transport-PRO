import { z } from "zod";

export const routeRecordSchema = z.object({
  departureDate: z.string().min(8),
  returnDate: z.string().min(8),
  route: z.string().min(2),
  dieselExpense: z.coerce.number().min(0),
  oilExpense: z.coerce.number().min(0),
  rationFoodExpense: z.coerce.number().min(0),
  mobileExpense: z.coerce.number().min(0),
  miscExpense: z.coerce.number().min(0),
  driverSalary: z.coerce.number().min(0),
  garageExpense: z.coerce.number().min(0),
  serviceExpense: z.coerce.number().min(0),
  income1: z.coerce.number().min(0),
  income2: z.coerce.number().min(0),
  income3: z.coerce.number().min(0),
  income4: z.coerce.number().min(0),
  additionalExpenseDetail: z.string().optional().default(""),
  additionalExpenseAmount: z.coerce.number().min(0),
});

export type RouteRecordPayload = z.infer<typeof routeRecordSchema>;

export function parseDdMmYyyy(dateText: string): Date | null {
  const match = dateText.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) return null;
  const [, dd, mm, yy] = match;
  const year = yy.length === 2 ? Number(`20${yy}`) : Number(yy);
  const d = new Date(year, Number(mm) - 1, Number(dd));
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== Number(mm) - 1 ||
    d.getDate() !== Number(dd)
  ) {
    return null;
  }
  return d;
}

export function toIsoDate(dateText: string): string {
  const parsed = parseDdMmYyyy(dateText);
  if (!parsed) return dateText;
  return parsed.toISOString();
}
