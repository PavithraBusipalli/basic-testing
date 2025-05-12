import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Add, expected: 4 },
    { a: 3, b: 2, action: Action.Add, expected: 5 }, 
    { a: 10, b: 34, action: Action.Subtract, expected: -24 },
    { a: -2, b: -3, action: Action.Subtract, expected: 1 },
    { a: 5, b: -2, action: Action.Multiply, expected: -10 },
    { a: 3, b: 0, action: Action.Divide, expected: Infinity },
    { a: 6, b: 0, action: Action.Exponentiate, expected: 1 }  
]; 

describe('simpleCalculator', () => {
    test.each(testCases)('Should return $expected for $action of $a and $b', ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    });
    test('should return null for invalid action', () => {
      const result = simpleCalculator({ a: 2, b: 3, action: 'logbase' });
      expect(result).toBeNull();
    });
    test('should return null for invalid arguments', () => {
      const result = simpleCalculator({ a: 'abc', b: '23', action: Action.Add });
      expect(result).toBeNull();
    });
});
