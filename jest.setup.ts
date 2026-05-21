/* eslint-disable @typescript-eslint/no-require-imports */
// Setup global pra testes.
// Reanimated depende de módulos nativos — mocka aqui pra não quebrar
// em ambiente Node.

jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: unknown) => c },
    View,
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: (cb: () => unknown) => cb(),
    withTiming: (value: unknown) => value,
    withRepeat: (value: unknown) => value,
    Easing: { inOut: () => undefined, ease: undefined },
    interpolateColor: (_v: number, _input: number[], output: string[]) => output[0],
  };
});
