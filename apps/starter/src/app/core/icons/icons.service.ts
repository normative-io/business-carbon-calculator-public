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
