// Copyright 2022 Meta Mind AB
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, Input, OnChanges } from '@angular/core';

import * as d3 from 'd3';

import { Impact } from '../../core/impact/impact.model';
import { CoverageStatus, getCoverageStatusFromEntry, getCoverageStatusWording } from '../../core/utils/coverage.utils';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';

import { CategoryBreakdown } from './home-donut.types';

const DONUT_DIMENSION = 304; // px

@Component({
  selector: 'n-home-donut',
  templateUrl: './home-donut.component.html',
  styleUrls: ['./home-donut.component.scss'],
})
export class HomeDonutComponent implements OnChanges {
  @Input() impact!: Impact | null;
  @Input() entry!: WizardEntryResponse | null;
  @Input() showImpact: boolean | null = null;

  scopeTotals: number[] = [];

  // Flag to control tooltip visibility.
  showTooltip = false;
  // Category name to show in tooltip.
  hoverCategory = '';
  // Category emission breakdown to show in tooltip.
  hoverValue?: number;
  // Coverage of entered expenses.
  coverage: CoverageStatus | null = null;

  // Template helpers
  CoverageStatus = CoverageStatus;
  getCoverageStatusWording = getCoverageStatusWording;

  ngOnChanges(): void {
    if (this.showImpact && this.impact) {
      d3.selectAll('#donut svg').remove();
      this.drawDonut(this.impact);
    } else {
      // Draw ghost donut
      d3.selectAll('#donut svg').remove();
      this.drawInitial([{ scope: 1, category: 'test', emission: { unit: '1', value: 1 } }], '#F3F3F3');
    }

    this.coverage = this.entry && getCoverageStatusFromEntry(this.entry.rawClientState);
  }

  getCoverageTooltip(coverage: CoverageStatus): { className: string; icon: string; text: string } {
    switch (coverage) {
      case CoverageStatus.HIGH:
        return {
          className: 'icon icon--positive',
          icon: 'n:check-mark-circle',
          text: 'Majority of the expenses entered are covered and matched to specific emission factors which means you have a comprehensive carbon estimate in scope 3, great job!',
        };

      case CoverageStatus.MEDIUM:
      case CoverageStatus.LOW:
        return {
          className: 'icon icon--negative',
          icon: 'n:info',
          text: 'For a more complete carbon estimate, try to match at least 80% of your total expenses to specific expense categories if possible.',
        };

      case CoverageStatus.ERROR_MULTIPLE_CURRENCIES:
      case CoverageStatus.ERROR_NO_SPEND:
        return {
          className: 'icon icon--info',
          icon: 'n:info',
          text:
            coverage === CoverageStatus.ERROR_MULTIPLE_CURRENCIES
              ? 'We are currently unable to compute your expense coverage as you have entered expenses in more than one currency.'
              : 'We are unable to compute your expense coverage because you did not enter your total expenses.',
        };
    }
  }

  /**
   * Draws initial donut chart shared between fully fledged and placeholder visualisations.
   */
  private drawInitial(data: CategoryBreakdown[], fillColor?: string) {
    const svg = d3
      .select('div#donut')
      .append('svg')
      .attr('viewBox', `0 0 ${DONUT_DIMENSION} ${DONUT_DIMENSION}`)
      .append('g')
      .attr('transform', `translate(${DONUT_DIMENSION / 2}, ${DONUT_DIMENSION / 2})`);

    const donutData = d3
      .pie<CategoryBreakdown>()
      .sort((d) => d.scope)
      .value((d) => d.emission.value)(data);
    const arc = d3.arc<d3.PieArcDatum<CategoryBreakdown>>().outerRadius(152).innerRadius(99);

    // Build the donut chart
    return svg
      .selectAll('slice')
      .data(donutData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', fillColor ?? ((d) => `var(--scope-${d.data.scope}-color)`))
      .attr('stroke', 'var(--background-color)');
  }

  /**
   * Draws a donut chart from ScopeBreakdown emission data.
   */
  private drawDonut(impact: Impact): void {
    const sortedScopes = [...impact.emissionCalculation.emissionsByScope].sort((x, y) => {
      return d3.ascending(x.scope, y.scope);
    });
    this.scopeTotals = [0, 0, 0].map(
      (_, index) => sortedScopes.find(({ scope }) => +scope.split(' ')[1] === index + 1)?.emission.value || 0
    );

    const categoryData: CategoryBreakdown[] = [];
    sortedScopes.forEach((emissionsByScope) =>
      emissionsByScope.categoryBreakdown.forEach((emissionsByCategory) => {
        categoryData.push({
          scope: +emissionsByScope.scope.split(' ')[1],
          category: emissionsByCategory.category,
          emission: emissionsByCategory.emission,
        });
      })
    );
    const initialDonut = this.drawInitial(categoryData);

    initialDonut
      .on('mouseover', (event, d: d3.PieArcDatum<CategoryBreakdown>) => {
        // Highlight donut segment and legend block
        d3.select(event.currentTarget).attr('fill', 'var(--highlight-color)');
        d3.select('#scope-' + d.data.scope).classed('highlight', true);

        // Show tooltip
        this.showTooltip = true;
        d3.select('#tooltip')
          .style('left', `${event.pageX + 50}px`)
          .style('top', `${event.pageY}px`);
        // Custom override for 'Fuel combustion' as it's more correct given our existing calculation model
        this.hoverCategory = d.data.category === 'Stationary combustion' ? 'Fuel combustion' : d.data.category;
        this.hoverValue = d.data.emission.value;
      })
      .on('mouseout', (event, d: d3.PieArcDatum<CategoryBreakdown>) => {
        // Remove highlight from donut segment and legend block
        d3.select(event.currentTarget).attr('fill', `var(--scope-${d.data.scope}-color)`);
        d3.select('#scope-' + d.data.scope).classed('highlight', false);

        // Hide the tooltip
        this.showTooltip = false;
      });
  }
}
