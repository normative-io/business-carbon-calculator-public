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

import { TonnesPipe } from './tonnes.pipe';
import { TonnesService } from './tonnes.service';

const FROM_CONVERSION = 'FROM CONVERSION';
const FROM_FORMAT = 'FROM FORMAT';

describe('TonnesPipe', () => {
  let format: jest.SpyInstance;
  let pipe: TonnesPipe;
  let toTonnes: jest.SpyInstance;

  beforeEach(() => {
    format = jest.fn(() => FROM_FORMAT);
    toTonnes = jest.fn(() => FROM_CONVERSION);

    const service = new (class {
      format = format;
      toTonnes = toTonnes;
    })() as unknown as TonnesService;

    pipe = new TonnesPipe(service);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return the value formatted by the tonnes service', () => {
      const value = 123;
      expect(pipe.transform(value)).toEqual(FROM_FORMAT);
      expect(toTonnes).toHaveBeenCalledWith(value);
      expect(format).toHaveBeenCalledWith(FROM_CONVERSION);
    });

    it('should return an empty string if no value', () => {
      expect(pipe.transform()).toEqual('');
    });
  });
});
