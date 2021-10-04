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
