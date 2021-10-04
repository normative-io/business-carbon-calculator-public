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
