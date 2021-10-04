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

import { ExpenseCategory, ExpenseField } from './wizard.types';

interface ExpenseCategoryMeta extends Omit<ExpenseCategory, 'subcategories'> {
  subcategories: ExpenseFieldMeta[];
}

type ExpenseFieldMeta = Omit<ExpenseField, 'type' | 'path'>;

// Exported for test.
export function buildExpenseFields(categories: ExpenseCategoryMeta[]): ExpenseCategory[] {
  let idx = 0;
  return categories.map((cat) => ({
    ...cat,
    subcategories: cat.subcategories.map((subcat: ExpenseFieldMeta) => {
      const out: ExpenseField = { ...subcat, type: 'expense', path: `expenses.${idx}` };
      idx++;
      return out;
    }),
  }));
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = buildExpenseFields([
  {
    name: 'Business travel',
    subcategories: [
      { label: 'Train tickets', normId: '03030700000000' },
      { label: 'Flight tickets', normId: '03030200000000' },
      { label: 'Bus tickets', normId: '03030400000000' },
      { label: 'Car rental', normId: '03030800000000' },
      { label: 'Hotels & Restaurants', normId: '03030101000000', tip: 'Example: Catering, hotel nights' },
    ],
  },
  {
    name: 'Transport / Freight',
    subcategories: [
      { label: 'Road Freight', normId: '03070400000000' },
      { label: 'Air Freight', normId: '03070500000000' },
      { label: 'Sea Freight', normId: '03070200000000' },
      { label: 'Rail Freight', normId: '03070300000000' },
      { label: 'Other transport services (Warehousing etc)', normId: '03070600000000' },
    ],
  },
  {
    name: 'Materials / Inventory',
    subcategories: [
      { label: 'Furniture', normId: '03011000000000', tip: 'Exampe: Chairs, tables and other office interior' },
      { label: 'Paper and packaging', normId: '03010108000000', tip: 'Example: Cardboard, paper, post-its' },
      { label: 'Textiles', normId: '03010200000000', tip: 'Example: Work clothes, fabrics, clothes resold in stores' },
      {
        label: 'Plastic products ',
        normId: '03010101020000',
        tip: 'Example: Office supplies, packaging or merchandise',
      },
      { label: 'Metal products', normId: '03010102040100', tip: 'Example: Steel beams, staplers or metals' },
      {
        label: 'Wood products',
        normId: '03010103000000',
        tip: 'Example: Boards, raw wood or building material made of wood ',
      },
      {
        label: 'Chemicals and pharmaceuticals',
        normId: '03010501000000',
        tip: 'Example: Paints, chemicals, medicines',
      },
      {
        label: 'Other general products',
        normId: '03010702000000',
        tip: 'Example: Food products, miscellaneous inventory',
      },
      {
        label: 'Books, movies and related services (Publishing, printing and reproduction of recorded media)',
        normId: '03010312010000',
      },
    ],
  },
  {
    name: 'Capital goods',
    subcategories: [
      {
        label: 'Phones, television and communication equipment',
        normId: '03020202000000',
        tip: 'Example: Smartphones, monitors or radios',
      },
      {
        label: 'Computers and office machinery',
        normId: '03010802020000',
        tip: 'Example: Printers, computers or label makers',
      },
      {
        label: 'Purchased vehicles (Motor Vehicles, Trailers, Boats etc)',
        normId: '03020102000000',
        tip: 'Example: Motor vehicles, trailers, boats et cetera',
      },
      {
        label: 'Other machinery, tools and equipment',
        normId: '03020204000000',
        tip: 'Example: Drills, large machinery, heaters or processors',
      },
    ],
  },
  {
    name: 'Services',
    subcategories: [
      {
        label: 'Legal, Accounting and Management Consultancy Services',
        normId: '03010307040000',
        tip: 'Example: Consultants, lawyers, accountants',
      },
      {
        label: 'Software, Hosting, Computer Programming & Related Activities',
        normId: '03010302050000',
        tip: 'Example: IT consultants, outsourced programming, Subscriptions, data hosting services, softwares, digital advertising',
      },
      { label: 'Insurance and pension funding', normId: '03010304020000', tip: 'Example: Insurance costs' },
      {
        label: 'Financial intermediation (i.e banking charges)',
        normId: '03010304030000',
        tip: 'Example: Banking fees and charges',
      },
      {
        label: 'Construction and maintenance',
        normId: '03011400000000',
        tip: 'Example: Construction projects, maintenance or renovations',
      },
    ],
  },
]);
