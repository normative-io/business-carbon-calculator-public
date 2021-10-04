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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ICONS } from '../core/icons/icons.model';

const SNIPPETS = {
  button: trim(`
    <button class="n-button n-button--outlined">Button (outlined)</button>
    <a class="n-button n-button--primary">Link (primary)</a>
  `),

  colors: trim(`
    @use '../../styles/colors' as colors;

    .class {
      color: colors.get-primary-color($hue);
    }
  `),

  icon: trim(`
    <mat-icon svgIcon="n:avatar"></mat-icon>
  `),

  input: trim(`
    <mat-form-field appearance="fill">
      <input matInput />
    </mat-form-field>
  `),

  select: trim(`
    <mat-form-field appearance="fill">
      <mat-select>
        <mat-option></mat-option>
      </mat-select>
      <mat-icon matSuffix svgIcon="n:chevron"></mat-icon>
    </mat-form-field>
  `),

  typography: trim(`
    @use '../../styles/typography' as typography;

    .class {
      @include typography.font($variant);
    }
  `),
};

const PRIMARY_COLOR_HUES = [50, 100, 200, 300, 400, 500, 600, 700, 800];

const BRAND_COLOR_HUES = [50, 100, 200, 300, 400, 500];

const TYPOGRAPHY_VARIANTS = [
  { name: 'Headine 1', id: 'h1' },
  { name: 'Headine 2', id: 'h2' },
  { name: 'Headine 3', id: 'h3' },
  { name: 'Headine 4', id: 'h4' },
  { name: 'Headine 5', id: 'h5' },
  { name: 'Headine 6', id: 'h6' },
  { name: 'Subtitle 1', id: 'subtitle-1' },
  { name: 'Subtitle 2', id: 'subtitle-2' },
  { name: 'Paragraph/intro', id: 'intro' },
  { name: 'Body 1', id: 'body-1' },
  { name: 'Body 2', id: 'body-2' },
  { name: 'Caption', id: 'caption' },
];

@Component({
  selector: 'n-styleguide',
  templateUrl: './styleguide.component.html',
  styleUrls: ['./styleguide.component.scss'],
})
export class StyleguideComponent implements OnInit {
  brand = BRAND_COLOR_HUES;

  form = new FormGroup({
    disabled: new FormControl('Disabled'),
    invalid1: new FormControl('Invalid', () => ({ invalid: true })),
    invalid2: new FormControl('Invalid', () => ({ invalid: true })),
  });

  icons = ICONS;

  primary = PRIMARY_COLOR_HUES;

  snippets = SNIPPETS;

  variants = TYPOGRAPHY_VARIANTS;

  ngOnInit() {
    this.form.get('disabled')?.disable();
    this.form.markAllAsTouched();
  }
}

function trim(snippet: string): string {
  return snippet.trim().replace(/^ {4}/gm, '');
}
