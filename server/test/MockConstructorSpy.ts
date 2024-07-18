// by Cristiano Santos on stackoverflow: https://stackoverflow.com/a/73948203
export function MockConstructorSpy(
  module: string,
  className: string,
  isDefault: boolean,
) {
  const spyMethod = jest.fn();
  jest.mock(module, () => {
    let MockClass = null;
    if (isDefault) {
      MockClass = jest.requireActual(module).default;
    } else {
      const { [className]: mockedModuleClass } = jest.requireActual(module);
      MockClass = mockedModuleClass;
    }
    class Mock extends MockClass {
      constructor(...args: any) {
        super(...args);
        spyMethod(...args);
      }
    }
    if (isDefault) return Mock;
    else return { [className]: Mock };
  });
  return spyMethod;
}
