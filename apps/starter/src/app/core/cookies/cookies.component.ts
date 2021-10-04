import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { delay, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';

import { CookiesSettingsComponent } from './cookies-settings.component';
import { slide } from './cookies.animations';
import { CookiesService } from './cookies.service';

const DELAY_ALERT_BY = 1000; // 1 second

@Component({
  selector: 'n-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss'],
  animations: [slide],
})
export class CookiesComponent implements OnDestroy, OnInit {
  show$ = this.cookiesService.accepted$.pipe(
    switchMap((accepted) => (accepted ? of(false) : of(true).pipe(delay(DELAY_ALERT_BY))))
  );

  dialogRef?: MatDialogRef<CookiesSettingsComponent>;
  subscription?: Subscription;

  constructor(private cookiesService: CookiesService, private dialog: MatDialog) {}

  ngOnInit() {
    this.subscription = this.cookiesService.configuring$
      .pipe(distinctUntilChanged())
      .subscribe((configuring) => this.toggleSettings(configuring));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.dialogRef?.close();
  }

  accept() {
    this.cookiesService.accept();
  }

  configure() {
    this.cookiesService.configure();
  }

  private toggleSettings(show: boolean) {
    if (show) {
      this.dialogRef = this.dialog.open(CookiesSettingsComponent);
      this.dialogRef.afterClosed().subscribe(() => this.cookiesService.configure(false));
    } else if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = undefined;
    }
  }
}
