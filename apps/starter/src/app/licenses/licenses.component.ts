import { Component, OnInit } from '@angular/core';

/**
 * Component that shows 3rd party licenses used by the app.
 */
@Component({
  selector: 'n-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent implements OnInit {
  ngOnInit() {
    // TODO: fetch any relevant 3rd party licenses dynamically
  }
}
