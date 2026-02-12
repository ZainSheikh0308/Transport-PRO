import { Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase/admin";
import type { RouteRecord, RouteRecordInput } from "@/lib/types";
import { parseDdMmYyyy } from "@/lib/validators/record";

function businessRef(businessId: string) {
  return getDb().collection("businesses").doc(businessId);
}

function recordsRef(businessId: string) {
  return businessRef(businessId).collection("routeRecords");
}

function calcTripDays(departureDate: string, returnDate: string) {
  const dep = parseDdMmYyyy(departureDate);
  const ret = parseDdMmYyyy(returnDate);
  if (!dep || !ret) return 0;
  const diff = ret.getTime() - dep.getTime();
  return Math.max(Math.round(diff / 86400000), 0);
}

function computeTotals(input: RouteRecordInput) {
  const totalExpenses =
    input.dieselExpense +
    input.oilExpense +
    input.rationFoodExpense +
    input.mobileExpense +
    input.miscExpense +
    input.driverSalary +
    input.garageExpense +
    input.serviceExpense;

  const totalIncome = input.income1 + input.income2 + input.income3 + input.income4;
  const net = totalIncome - (totalExpenses + input.additionalExpenseAmount);

  return {
    totalExpenses,
    totalIncome,
    profit: Math.max(net, 0),
    loss: Math.max(-net, 0),
  };
}

function mapDoc(id: string, businessId: string, data: FirebaseFirestore.DocumentData): RouteRecord {
  return {
    id,
    businessId,
    departureDate: data.departureDate,
    returnDate: data.returnDate,
    route: data.route,
    dieselExpense: data.dieselExpense ?? 0,
    oilExpense: data.oilExpense ?? 0,
    rationFoodExpense: data.rationFoodExpense ?? 0,
    mobileExpense: data.mobileExpense ?? 0,
    miscExpense: data.miscExpense ?? 0,
    driverSalary: data.driverSalary ?? 0,
    garageExpense: data.garageExpense ?? 0,
    serviceExpense: data.serviceExpense ?? 0,
    income1: data.income1 ?? 0,
    income2: data.income2 ?? 0,
    income3: data.income3 ?? 0,
    income4: data.income4 ?? 0,
    additionalExpenseDetail: data.additionalExpenseDetail ?? "",
    additionalExpenseAmount: data.additionalExpenseAmount ?? 0,
    tripDays: data.tripDays ?? 0,
    totalExpenses: data.totalExpenses ?? 0,
    totalIncome: data.totalIncome ?? 0,
    profit: data.profit ?? 0,
    loss: data.loss ?? 0,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    createdBy: data.createdBy ?? "",
  };
}

export async function ensureUserBusiness(uid: string, email: string | undefined) {
  const db = getDb();
  const userDocRef = db.collection("users").doc(uid);
  const bizDocRef = businessRef(uid);

  await db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userDocRef);
    if (!userSnap.exists) {
      tx.set(userDocRef, {
        email: email ?? "",
        defaultBusinessId: uid,
        planStatus: "trial",
        planType: "free",
        billingState: "none",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    const bizSnap = await tx.get(bizDocRef);
    if (!bizSnap.exists) {
      tx.set(bizDocRef, {
        ownerUid: uid,
        name: "My Transport Business",
        timezone: "UTC",
        currency: "PKR",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  });

  return uid;
}

export async function createRouteRecord(
  businessId: string,
  uid: string,
  input: RouteRecordInput,
) {
  const totals = computeTotals(input);
  const tripDays = calcTripDays(input.departureDate, input.returnDate);
  const now = Timestamp.now();
  const docRef = recordsRef(businessId).doc();

  await docRef.set({
    ...input,
    ...totals,
    tripDays,
    createdBy: uid,
    createdAt: now,
    updatedAt: now,
  });

  const snap = await docRef.get();
  return mapDoc(snap.id, businessId, snap.data() ?? {});
}

export async function updateRouteRecord(
  businessId: string,
  id: string,
  input: RouteRecordInput,
) {
  const totals = computeTotals(input);
  const tripDays = calcTripDays(input.departureDate, input.returnDate);
  const docRef = recordsRef(businessId).doc(id);

  await docRef.update({
    ...input,
    ...totals,
    tripDays,
    updatedAt: Timestamp.now(),
  });

  const snap = await docRef.get();
  return mapDoc(snap.id, businessId, snap.data() ?? {});
}

export async function deleteRouteRecord(businessId: string, id: string) {
  await recordsRef(businessId).doc(id).delete();
}

export async function listRouteRecords(businessId: string) {
  const snap = await recordsRef(businessId).orderBy("createdAt", "desc").limit(1000).get();
  return snap.docs.map((d) => mapDoc(d.id, businessId, d.data()));
}
