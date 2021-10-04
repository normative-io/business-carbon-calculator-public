import { HttpErrorResponse } from '@angular/common/http';

import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';

interface EmissionValue {
  value: number;
  unit: string;
  indicator?: string;
}

export interface EmissionsByCategory {
  category: string;
  emission: EmissionValue;
}

interface EmissionsByScope {
  scope: string;
  emission: EmissionValue;
  categoryBreakdown: EmissionsByCategory[];
}

interface EmissionCalculation {
  totalEmissions: EmissionValue;
  emissionsByScope: EmissionsByScope[];
}

export interface Impact {
  calculationComplete: boolean;
  emissionCalculation: EmissionCalculation;
  starterEntryId: string;
}

export interface ImpactStateModel {
  entries: WizardEntryResponse[];
  id: string | null;
  impacts: Impact[];
  error: HttpErrorResponse | null;
}
