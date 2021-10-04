import { Component } from '@angular/core';

import { IconsService } from './core/icons/icons.service';
import { LoggingService } from './core/logging/logging.service';
import { UserService } from './core/user/user.service';

@Component({
  selector: 'n-business-carbon-calculator',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    // To ensure services are initialized across all routes
    private iconsService: IconsService,
    private userService: UserService,
    private loggingService: LoggingService
  ) {}
}
