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

import { BoldifyPipe } from './boldify.pipe';

describe('BoldifyPipe', () => {
  const pipe = new BoldifyPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert bold markdown syntax to strong tags', () => {
    expect(pipe.transform('one **two three**')).toEqual('one <strong>two three</strong>');
    expect(pipe.transform('one **two** **three**')).toEqual('one <strong>two</strong> <strong>three</strong>');
  });

  it('should ignore all other markdown syntax', () => {
    const value = '*one* _two_ __three__';
    expect(pipe.transform(value)).toEqual(value);
  });
});
