import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ICONS, LOGOS } from './icons.model';

@Injectable({ providedIn: 'root' })
export class IconsService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    for (const icon of ICONS) {
      this.addSvgIcon(icon);
    }

    for (const logo of LOGOS) {
      this.addSvgIcon(logo, `/logos/${logo}.svg`);
    }
  }

  addSvgIcon(name: string, url = `/icons/${name}.svg`) {
    const resourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.iconRegistry.addSvgIconInNamespace('n', name, resourceUrl);
  }
}
