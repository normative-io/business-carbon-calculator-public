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

import { HeatingType, YesNoUnknown } from './ngxs/wizard.model';
import { NavigationWarning } from './wizard-navigation/wizard-navigation.component';
import { EXPENSE_CATEGORIES } from './wizard.expenses';
import { LoadingPage, Page, Unit, UnitType } from './wizard.types';

// Warnings

export const EMPLOYEES_PAGE_ID = 'Employees';
export const NUMBER_OF_EMPLOYEES_THRESHOLD = 50;
export const NUMBER_OF_EMPLOYEES_WARNING: NavigationWarning = {
  text: 'The Business Carbon Calculator was built for small businesses with 50 employees or less operating in one country. We have other solutions that will fit your needs better, book a demo to get in touch with us.',
  demo: true,
};

// Units

export const DEFAULT_UNITS: { [unit in UnitType]: string } = {
  area: 'm^2',
  currency: 'EUR',
  length: 'km',
};

export const AREA_UNITS: Unit[] = [
  { name: 'm²', value: 'm^2' },
  { name: 'ft²', value: 'ft^2' },
];

export const CURRENCY_UNITS: Unit[] = [
  { name: 'AED', shortName: 'د.إ', value: 'AED' },
  { name: 'AFN', shortName: '؋', value: 'AFN' },
  { name: 'ALL', shortName: 'L', value: 'ALL' },
  { name: 'AMD', shortName: '֏', value: 'AMD' },
  { name: 'ANG', shortName: 'ƒ', value: 'ANG' },
  { name: 'AOA', shortName: 'Kz', value: 'AOA' },
  { name: 'ARS', shortName: '$', value: 'ARS' },
  { name: 'AUD', shortName: '$', value: 'AUD' },
  { name: 'AWG', shortName: 'ƒ', value: 'AWG' },
  { name: 'AZN', shortName: '₼', value: 'AZN' },
  { name: 'BAM', shortName: 'KM', value: 'BAM' },
  { name: 'BBD', shortName: '$', value: 'BBD' },
  { name: 'BDT', shortName: '৳', value: 'BDT' },
  { name: 'BGN', shortName: 'лв', value: 'BGN' },
  { name: 'BHD', shortName: '.د.ب', value: 'BHD' },
  { name: 'BIF', shortName: 'FBu', value: 'BIF' },
  { name: 'BMD', shortName: '$', value: 'BMD' },
  { name: 'BND', shortName: '$', value: 'BND' },
  { name: 'BOB', shortName: '$b', value: 'BOB' },
  { name: 'BRL', shortName: 'R$', value: 'BRL' },
  { name: 'BSD', shortName: '$', value: 'BSD' },
  { name: 'BWP', shortName: 'P', value: 'BWP' },
  { name: 'BYR', shortName: 'Br', value: 'BYR' },
  { name: 'BZD', shortName: 'BZ$', value: 'BZD' },
  { name: 'CAD', shortName: '$', value: 'CAD' },
  { name: 'CDF', shortName: 'FC', value: 'CDF' },
  { name: 'CHF', value: 'CHF' },
  { name: 'CLP', shortName: '$', value: 'CLP' },
  { name: 'CNY', shortName: '¥', value: 'CNY' },
  { name: 'COP', shortName: '$', value: 'COP' },
  { name: 'CRC', shortName: '₡', value: 'CRC' },
  { name: 'CUP', shortName: '₱', value: 'CUP' },
  { name: 'CVE', shortName: '$', value: 'CVE' },
  { name: 'CZK', shortName: 'Kč', value: 'CZK' },
  { name: 'DJF', shortName: 'Fdj', value: 'DJF' },
  { name: 'DKK', shortName: 'kr', value: 'DKK' },
  { name: 'DOP', shortName: 'RD$', value: 'DOP' },
  { name: 'DZD', shortName: 'دج', value: 'DZD' },
  { name: 'EGP', shortName: '£', value: 'EGP' },
  { name: 'ERN', shortName: 'Nfk', value: 'ERN' },
  { name: 'ETB', shortName: 'Br', value: 'ETB' },
  { name: 'EUR', shortName: '€', value: 'EUR' },
  { name: 'FJD', shortName: '$', value: 'FJD' },
  { name: 'FKP', shortName: '£', value: 'FKP' },
  { name: 'GBP', shortName: '£', value: 'GBP' },
  { name: 'GEL', shortName: '₾', value: 'GEL' },
  { name: 'GHS', shortName: 'GH₵', value: 'GHS' },
  { name: 'GIP', shortName: '£', value: 'GIP' },
  { name: 'GMD', shortName: 'D', value: 'GMD' },
  { name: 'GNF', shortName: 'FG', value: 'GNF' },
  { name: 'GTQ', shortName: 'Q', value: 'GTQ' },
  { name: 'GYD', shortName: '$', value: 'GYD' },
  { name: 'HKD', shortName: '$', value: 'HKD' },
  { name: 'HNL', shortName: 'L', value: 'HNL' },
  { name: 'HRK', shortName: 'kn', value: 'HRK' },
  { name: 'HTG', shortName: 'G', value: 'HTG' },
  { name: 'HUF', shortName: 'Ft', value: 'HUF' },
  { name: 'IDR', shortName: 'Rp', value: 'IDR' },
  { name: 'ILS', shortName: '₪', value: 'ILS' },
  { name: 'INR', shortName: '₹', value: 'INR' },
  { name: 'IQD', shortName: 'ع.د', value: 'IQD' },
  { name: 'IRR', shortName: '﷼', value: 'IRR' },
  { name: 'ISK', shortName: 'kr', value: 'ISK' },
  { name: 'JMD', shortName: 'J$', value: 'JMD' },
  { name: 'JOD', shortName: 'JD', value: 'JOD' },
  { name: 'JPY', shortName: '¥', value: 'JPY' },
  { name: 'KES', shortName: 'KSh', value: 'KES' },
  { name: 'KGS', shortName: 'лв', value: 'KGS' },
  { name: 'KHR', shortName: '៛', value: 'KHR' },
  { name: 'KMF', shortName: 'CF', value: 'KMF' },
  { name: 'KPW', shortName: '₩', value: 'KPW' },
  { name: 'KRW', shortName: '₩', value: 'KRW' },
  { name: 'KWD', shortName: 'KD', value: 'KWD' },
  { name: 'KYD', shortName: '$', value: 'KYD' },
  { name: 'KZT', shortName: '₸', value: 'KZT' },
  { name: 'LAK', shortName: '₭', value: 'LAK' },
  { name: 'LBP', shortName: '£', value: 'LBP' },
  { name: 'LKR', shortName: '₨', value: 'LKR' },
  { name: 'LRD', shortName: '$', value: 'LRD' },
  { name: 'LSL', shortName: 'M', value: 'LSL' },
  { name: 'LYD', shortName: 'LD', value: 'LYD' },
  { name: 'MAD', value: 'MAD' },
  { name: 'MDL', shortName: 'lei', value: 'MDL' },
  { name: 'MGA', shortName: 'Ar', value: 'MGA' },
  { name: 'MKD', shortName: 'ден', value: 'MKD' },
  { name: 'MMK', shortName: 'K', value: 'MMK' },
  { name: 'MNT', shortName: '₮', value: 'MNT' },
  { name: 'MOP', shortName: 'MOP$', value: 'MOP' },
  { name: 'MRO', shortName: 'UM', value: 'MRO' },
  { name: 'MUR', shortName: '₨', value: 'MUR' },
  { name: 'MVR', shortName: 'Rf', value: 'MVR' },
  { name: 'MWK', shortName: 'MK', value: 'MWK' },
  { name: 'MXN', shortName: '$', value: 'MXN' },
  { name: 'MYR', shortName: 'RM', value: 'MYR' },
  { name: 'MZN', shortName: 'MT', value: 'MZN' },
  { name: 'NAD', shortName: '$', value: 'NAD' },
  { name: 'NGN', shortName: '₦', value: 'NGN' },
  { name: 'NIO', shortName: 'C$', value: 'NIO' },
  { name: 'NOK', shortName: 'kr', value: 'NOK' },
  { name: 'NPR', shortName: '₨', value: 'NPR' },
  { name: 'NZD', shortName: '$', value: 'NZD' },
  { name: 'OMR', shortName: '﷼', value: 'OMR' },
  { name: 'PAB', shortName: 'B/.', value: 'PAB' },
  { name: 'PEN', shortName: 'S/.', value: 'PEN' },
  { name: 'PGK', shortName: 'K', value: 'PGK' },
  { name: 'PHP', shortName: '₱', value: 'PHP' },
  { name: 'PKR', shortName: '₨', value: 'PKR' },
  { name: 'PLN', shortName: 'zł', value: 'PLN' },
  { name: 'PYG', shortName: 'Gs', value: 'PYG' },
  { name: 'QAR', shortName: '﷼', value: 'QAR' },
  { name: 'RON', shortName: 'lei', value: 'RON' },
  { name: 'RSD', shortName: 'Дин.', value: 'RSD' },
  { name: 'RUB', shortName: '₽', value: 'RUB' },
  { name: 'RWF', shortName: 'R₣', value: 'RWF' },
  { name: 'SAR', shortName: '﷼', value: 'SAR' },
  { name: 'SBD', shortName: '$', value: 'SBD' },
  { name: 'SCR', shortName: '₨', value: 'SCR' },
  { name: 'SDG', shortName: '.ج.س', value: 'SDG' },
  { name: 'SEK', shortName: 'kr', value: 'SEK' },
  { name: 'SGD', shortName: 'S$', value: 'SGD' },
  { name: 'SHP', shortName: '£', value: 'SHP' },
  { name: 'SLL', shortName: 'Le', value: 'SLL' },
  { name: 'SOS', shortName: 'S', value: 'SOS' },
  { name: 'SRD', shortName: '$', value: 'SRD' },
  { name: 'SSP', shortName: '£', value: 'SSP' },
  { name: 'STD', shortName: 'Db', value: 'STD' },
  { name: 'SYP', shortName: '£', value: 'SYP' },
  { name: 'SZL', shortName: 'E', value: 'SZL' },
  { name: 'THB', shortName: '฿', value: 'THB' },
  { name: 'TJS', shortName: 'SM', value: 'TJS' },
  { name: 'TMT', shortName: 'T', value: 'TMT' },
  { name: 'TND', shortName: 'د.ت', value: 'TND' },
  { name: 'TOP', shortName: 'T$', value: 'TOP' },
  { name: 'TRY', shortName: '₺', value: 'TRY' },
  { name: 'TTD', shortName: 'TT$', value: 'TTD' },
  { name: 'TWD', shortName: 'NT$', value: 'TWD' },
  { name: 'TZS', shortName: 'TSh', value: 'TZS' },
  { name: 'UAH', shortName: '₴', value: 'UAH' },
  { name: 'UGX', shortName: 'USh', value: 'UGX' },
  { name: 'USD', shortName: '$', value: 'USD' },
  { name: 'UYU', shortName: '$U', value: 'UYU' },
  { name: 'UZS', shortName: 'лв', value: 'UZS' },
  { name: 'VEF', shortName: 'Bs', value: 'VEF' },
  { name: 'VND', shortName: '₫', value: 'VND' },
  { name: 'VUV', shortName: 'VT', value: 'VUV' },
  { name: 'WST', shortName: 'WS$', value: 'WST' },
  { name: 'XAF', shortName: 'FCFA', value: 'XAF' },
  { name: 'XCD', shortName: '$', value: 'XCD' },
  { name: 'XOF', shortName: 'CFA', value: 'XOF' },
  { name: 'XPF', shortName: '₣', value: 'XPF' },
  { name: 'YER', shortName: '﷼', value: 'YER' },
  { name: 'ZAR', shortName: 'R', value: 'ZAR' },
  { name: 'ZMW', shortName: 'ZK', value: 'ZMW' },
];

export const LENGTH_UNITS: Unit[] = [
  { name: 'miles', value: 'miles' },
  { name: 'km', value: 'km' },
];

// Content

type PageContent = Pick<Page, 'trilogy' | 'title' | 'icon'>;

const FUEL_CONTENT: PageContent = {
  trilogy: 2,
  title: 'Company vehicles',
  icon: 'car',
};

const MACHINERY_CONTENT: PageContent = {
  trilogy: 2,
  title: 'Machinery',
  icon: 'factory',
};

const ELECTRICITY_CONTENT: PageContent = {
  trilogy: 2,
  title: 'Electricity',
  icon: 'lightning-bolt',
};

const HEATING_CONTENT: PageContent = {
  trilogy: 2,
  title: 'Heating',
  icon: 'lightning-bolt',
};

// Config

export const PAGES: Page[] = [
  {
    id: 'Welcome',
    type: 'splash',

    trilogy: 1,
    title: 'Emissions estimates are all about the **data**',
    nextLabel: 'Next',
  },
  {
    id: 'BeforeWeStart',
    type: 'splash',

    trilogy: 1,
    title: 'Before **we start**',
    nextLabel: 'Start',
  },

  {
    id: 'TimePeriod',
    type: 'question',

    trilogy: 1,
    title: 'Time period',
    icon: 'time',

    fields: [
      {
        path: 'timePeriod',
        type: 'date',
        label: 'What is the time period you want to calculate emissions for?',
      },
    ],
  },

  {
    id: EMPLOYEES_PAGE_ID,
    type: 'question',

    trilogy: 1,
    title: 'Employees',
    icon: 'capital',
    why: 'We need the total headcount of your company at the end of year to understand your size. The Business Carbon Calculator is designed for small businesses with less than 50 employees.',

    fields: [
      {
        path: 'numberOfEmployees',
        type: 'number',

        label: 'How many people worked at your company at the end of this time period?',
        tip: 'Tip: Your HR or management team would know this',
        placeholder: '0',
        suffix: 'employees',
      },
    ],
  },

  {
    id: 'Revenue',
    type: 'question',

    trilogy: 1,
    title: 'Revenue',
    icon: 'calculator',
    why: 'Sharing your basic business data will help us benchmark your emissions against companies of similar size/revenue in the future. It will not be shared externally.',

    fields: [
      {
        path: 'revenue',
        type: 'unit',

        label: 'What was your company’s revenue?',
        tip: 'Tip: Your finance team would know this',
        placeholder: '0',
        units: 'currency',
      },
    ],
  },

  {
    id: 'FuelIntro',
    type: 'question',

    ...FUEL_CONTENT,
    why: 'This represents direct emissions from your company’s activities.',

    fields: [
      {
        path: 'fuel.hasVehicles',
        type: 'radio',
        label: 'Did your company own or maintain long-term leases on vehicles?',
        tip: 'Example: Cars or trucks',

        options: [
          { label: 'Yes', value: YesNoUnknown.YES },
          { label: 'No', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'FuelVolume',
    type: 'question',
    hideIf: ({ fuel }) => fuel?.hasVehicles === YesNoUnknown.NO,

    ...FUEL_CONTENT,
    why: 'Our emissions engine takes the total litres consumed and pairs it with an emission factor for fuel to calculate the CO2 equivalent.',

    fields: [
      {
        path: 'fuel.volume.value',
        type: 'number',

        label: 'How many litres of petrol and diesel fuel did your company’s vehicles use?',
        placeholder: '0',
        suffix: 'litres',
      },
      {
        path: 'fuel.hasVolume',
        type: 'radio',

        options: [
          { label: 'Our vehicles didn’t use fuel', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'FuelSpend',
    type: 'question',
    hideIf: ({ fuel }) =>
      fuel?.hasVehicles === YesNoUnknown.NO ||
      fuel?.hasVolume === YesNoUnknown.YES ||
      fuel?.hasVolume === YesNoUnknown.NO,

    ...FUEL_CONTENT,
    why: 'Our emissions engine takes your total spend on fuel, accounting for the average price of fuel in your company’s country of operations, and pairs it with an emission factor to calculate the CO2 equivalent.',

    fields: [
      {
        path: 'fuel.spend',
        type: 'unit',

        label: 'How much did your company spend on petrol and diesel fuel for vehicles?',
        tip: 'Tip: This is sometimes logged under reimbursements',
        placeholder: '0',
        units: 'currency',
      },
      {
        path: 'fuel.hasSpend',
        type: 'radio',

        options: [{ label: 'I don’t know', value: YesNoUnknown.UNKNOWN }],
      },
    ],
  },

  {
    id: 'MachineryIntro',
    type: 'question',

    ...MACHINERY_CONTENT,
    why: 'This represents direct emissions from your company’s activities.',

    fields: [
      {
        path: 'machinery.hasMachinery',
        type: 'radio',
        label: 'Did your company own or maintain long-term leases on machinery?',
        tip: 'Example: Generators or turbines',

        options: [
          { label: 'Yes', value: YesNoUnknown.YES },
          { label: 'No', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'MachineryVolume',
    type: 'question',
    hideIf: ({ machinery }) => machinery?.hasMachinery === YesNoUnknown.NO,

    ...MACHINERY_CONTENT,
    why: 'Our emissions engine takes the total litres consumed and pairs it with an emissions factor for fuel to calculate the CO2 equivalent.',

    fields: [
      {
        path: 'machinery.volume.value',
        type: 'number',

        label: 'How many litres of petrol and diesel fuel did your company’s machinery use?',
        placeholder: '0',
        suffix: 'litres',
      },
      {
        path: 'machinery.hasVolume',
        type: 'radio',

        options: [
          { label: 'Our machinery didn’t use fuel', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'MachinerySpend',
    type: 'question',
    hideIf: ({ machinery }) =>
      machinery?.hasMachinery === YesNoUnknown.NO ||
      machinery?.hasVolume === YesNoUnknown.YES ||
      machinery?.hasVolume === YesNoUnknown.NO,

    ...MACHINERY_CONTENT,
    why: 'Our emissions engine uses your total spend on fuel, taking the average price of fuel in your country into account, and pairs it with an emission factor to calculate your CO2 equivalent.',

    fields: [
      {
        path: 'machinery.spend',
        type: 'unit',

        label: 'How much did your company spend on petrol and diesel fuel for machinery?',
        tip: 'Tip: Your accountant would know this',
        placeholder: '0',
        units: 'currency',
      },
      {
        path: 'machinery.hasSpend',
        type: 'radio',

        options: [{ label: 'I don’t know', value: YesNoUnknown.UNKNOWN }],
      },
    ],
  },

  {
    id: 'Facilities',
    type: 'question',

    ...ELECTRICITY_CONTENT,
    why: 'The size of your company’s facilities, rented or owned, helps us determine energy usage and associated emissions. Include all office and warehouse spaces if applicable, exclude home office space.',

    fields: [
      {
        path: 'facilities.size',
        type: 'unit',

        label: 'How large were your company’s facilities?',
        tip: 'Tip: This includes warehouses and garages',
        placeholder: '0',
        units: 'area',
      },
      {
        path: 'facilities.hasFacilities',
        type: 'radio',

        options: [
          { label: 'We didn’t own or lease any facilities', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'ElectricityConsumption',
    type: 'question',
    hideIf: ({ facilities }) => facilities?.hasFacilities === YesNoUnknown.NO,

    ...ELECTRICITY_CONTENT,
    why: 'The kWh value will be paired with an emission factor in your company’s country of operation.',

    fields: [
      {
        path: 'electricity.energy.value',
        type: 'number',
        label: 'How much electricity did your company consume?',
        tip: 'Tip: This can often be found on your electricity bills',
        placeholder: '0',
        suffix: 'kWh',
      },
      {
        path: 'electricity.hasEnergy',
        type: 'radio',
        options: [{ label: 'I don’t know', value: YesNoUnknown.UNKNOWN }],
      },
    ],
  },

  {
    id: 'Electricity',
    type: 'question',
    hideIf: ({ electricity, facilities }) =>
      facilities?.hasFacilities === YesNoUnknown.NO || electricity?.hasEnergy === YesNoUnknown.YES,

    ...ELECTRICITY_CONTENT,
    why: 'We use the average price per kWh to convert your company’s data into energy units. Those units will be paired with an emission factor in your company’s country of operation.',

    fields: [
      {
        path: 'electricity.spend',
        type: 'unit',

        label: 'How much did your company spend on electricity?',
        tip: 'Tip: Ask your finance team or accountant',
        placeholder: '0',
        units: 'currency',
      },
      {
        path: 'electricity.hasSpend',
        type: 'radio',

        options: [
          {
            label: 'We didn’t pay for electricity directly (it was included in our rent)',
            value: YesNoUnknown.NO,
          },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'Renewable',
    type: 'question',
    hideIf: ({ electricity, facilities }) =>
      facilities?.hasFacilities === YesNoUnknown.NO || electricity?.hasSpend === YesNoUnknown.NO,

    ...ELECTRICITY_CONTENT,
    why: 'If your company buys 100% renewable electricity from its electricity supplier, the corresponding energy usage will produce zero emissions. This is often shown on your invoice and likely has an additional cost.',

    fields: [
      {
        type: 'radio',
        path: 'electricity.hasRenewable',

        label: 'Did your company receive 100% renewable electricity?',
        tip: 'Tip: This is usually stated on your electricity bill',
        options: [
          { label: 'Yes', value: YesNoUnknown.YES },
          { label: 'No', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'Heating',
    type: 'question',
    hideIf: ({ facilities }) => facilities?.hasFacilities === YesNoUnknown.NO,

    ...HEATING_CONTENT,
    why: 'Different heating sources produce varying amounts of emissions, therefore it is important to know the heating source.',

    fields: [
      {
        path: 'heating.type',
        type: 'radio',

        label: 'Did your company receive heating?',
        tip: 'Tip: Your landlord or office manager would know this',
        options: [
          { label: 'Yes, via district heating', value: HeatingType.DISTRICT },
          { label: 'Yes, via natural gas', value: HeatingType.NATURAL_GAS },
          { label: 'Yes, via electricity', value: HeatingType.ELECTRICITY },
          { label: 'Yes, via another method', value: HeatingType.OTHER },
          { label: 'No, not applicable', value: HeatingType.NONE },
          { label: 'I don’t know', value: HeatingType.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'HeatingElectricity',
    type: 'question',
    hideIf: ({ heating, facilities }) =>
      facilities?.hasFacilities === YesNoUnknown.NO || heating?.type !== HeatingType.ELECTRICITY,

    ...HEATING_CONTENT,

    fields: [
      {
        path: 'heating.includedWithElectricity',
        type: 'radio',

        label: 'Is your heating included in the electricity bill?',
        tip: 'If so, we won’t ask you for a separate heating bill and assume it is already covered by the electricity expenses you’ve entered.',
        options: [
          { label: 'Yes', value: YesNoUnknown.YES },
          { label: 'No', value: YesNoUnknown.NO },
        ],
      },
    ],
  },

  {
    id: 'HeatingConsumption',
    type: 'question',
    hideIf: ({ facilities, heating }) =>
      facilities?.hasFacilities === YesNoUnknown.NO ||
      heating?.type === HeatingType.NONE ||
      heating?.includedWithElectricity === YesNoUnknown.YES,

    ...HEATING_CONTENT,
    why: 'The kWh value will be paired with an emission factor depending on your heating source and your company’s country of operation.',

    fields: [
      {
        type: 'number',
        path: 'heating.energy.value',

        label: 'How much heating did your company consume?',
        tip: 'Tip: This can sometimes be found on your heating bill',
        placeholder: '0',
        suffix: 'kWh',
      },
      {
        path: 'heating.hasEnergy',
        type: 'radio',
        options: [{ label: 'I don’t know', value: YesNoUnknown.UNKNOWN }],
      },
    ],
  },

  {
    id: 'HeatingSpend',
    type: 'question',
    hideIf: ({ facilities, heating }) =>
      facilities?.hasFacilities === YesNoUnknown.NO ||
      heating?.type === HeatingType.NONE ||
      heating?.includedWithElectricity === YesNoUnknown.YES ||
      heating?.hasEnergy === YesNoUnknown.YES,

    ...HEATING_CONTENT,
    why: 'We use the average price per kWh to convert the data you enter into energy units. Those units will be paired with an emission factor depending on your heating source and your company’s country of operation.',

    fields: [
      {
        type: 'unit',
        path: 'heating.spend',

        label: 'How much did your company spend on heating?',
        tip: 'Tip: Your finance team would know this',
        placeholder: '0',
        units: 'currency',
      },
      {
        path: 'heating.hasSpend',
        type: 'radio',
        options: [
          { label: 'We didn’t pay for heating directly (it was included in our rent)', value: YesNoUnknown.NO },
          { label: 'I don’t know', value: YesNoUnknown.UNKNOWN },
        ],
      },
    ],
  },

  {
    id: 'ExpensesIntro',
    type: 'splash',

    trilogy: 3,
    title: '**Nice work!**',
    description: 'Let’s get going on your expenses to get the full picture. Before you start:',
    nextLabel: 'Add expenses',
  },

  {
    id: 'Expenditures',
    type: 'question',

    trilogy: 3,
    title: 'Expenses',
    icon: 'calculator',
    why: 'Purchases made by your company result in indirect emissions. These are commonly considered to be supply chain emissions and are part of your company’s carbon footprint. Exclude any heating, electricity and fuel costs that are already covered in previous questions. ',

    fields: [
      {
        path: 'spend',
        type: 'unit',

        label: 'What were your company’s total expenses?',
        tip: 'Tip: Excludes salary, taxes, and any costs pertaining to fuel usage, heating, or electricity covered in previous questions',
        placeholder: '0',
        units: 'currency',
      },
    ],
  },

  {
    id: 'ExpensesCategories',
    type: 'expenses',

    trilogy: 3,
    title: 'Expenses',
    description: 'The more categories you fill out the more accurate your carbon footprint estimation will be.',
    why: 'Purchases you make result in indirect emissions that are part of your carbon footprint. We match emissions factors for a specific sector to your spending and then calculate your total indirect supply chain emissions. The more expense data you can provide and categorise, the more comprehensive your emissions estimate will be.',
    nextLabel: 'Calculate emissions',

    categories: EXPENSE_CATEGORIES,
  },
];

export const LOADING_PAGE: LoadingPage = {
  id: 'Loading',
  type: 'loading',

  title: 'Thank you.<br />Please wait while we **process your data.**',
  animation: '/lottie/loading.json',
  dimensions: '100px',
  labels: ['Analyzing data …', 'Gathering emission factors …'],
};
