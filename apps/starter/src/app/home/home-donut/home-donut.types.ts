export type Emission = {
  unit: string;
  value: number;
};

export type CategoryBreakdown = {
  scope: number;
  category: string;
  emission: Emission;
};

export type ScopeBreakdown = {
  scope: number;
  emission: Emission;
  categoryBreakdown: CategoryBreakdown[];
};
