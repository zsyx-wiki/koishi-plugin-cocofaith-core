import type { BonusCalculation } from "../bonus";
import type { FaithCoreUserData } from "../types";

export type FaithCurrency = "gold" | "ascension_score";
export type FaithMoney = Partial<Record<FaithCurrency, number>>;

export interface FaithWallet {
  uid: number;
  gold: number;
  ascension_score: number;
}

export interface FaithEconomyOptions {
  source: string;
  idempotencyKey?: string;
  operatorUid?: number;
  metadata?: Record<string, unknown>;
}

export interface FaithRewardOptions extends FaithEconomyOptions {
  applyBonuses?: boolean;
}

export interface FaithRewardPreview {
  uid: number;
  requested: Readonly<FaithMoney>;
  applied: Readonly<FaithMoney>;
  calculations: Readonly<Partial<Record<FaithCurrency, BonusCalculation>>>;
}

export interface FaithEconomyChangeResult {
  uid: number;
  requested: Readonly<FaithMoney>;
  applied: Readonly<FaithMoney>;
  before: Readonly<FaithWallet>;
  after: Readonly<FaithWallet>;
  user: FaithCoreUserData;
}

export interface FaithTransferResult {
  amount: Readonly<FaithMoney>;
  from: FaithEconomyChangeResult;
  to: FaithEconomyChangeResult;
}

export const FAITH_CURRENCIES = Object.freeze({
  gold: Object.freeze({ id: "gold" as const, name: "金币" }),
  ascension_score: Object.freeze({ id: "ascension_score" as const, name: "登神分数" }),
});
