import { Component, Input } from '@angular/core';

import { LoadingPage } from '../wizard.types';

@Component({
  selector: 'n-wizard-loader',
  templateUrl: './wizard-loader.component.html',
  styleUrls: ['./wizard-loader.component.scss'],
})
export class WizardLoaderComponent {
  @Input() page!: LoadingPage;
}
