// @ts-nocheck

import { capitalize } from '../../src/shared/utils';

describe('capitalize function', () => {
    it('should capitalize the first letter of a word', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should return an empty string if input is empty', () => {
        expect(capitalize('')).toBe('');
    });

    it('should capitalize the first letter of a sentence', () => {
        expect(capitalize('this is a sentence.')).toBe('This is a sentence.');
    });

    it('should return the same string if first letter is already capitalized', () => {
        expect(capitalize('Capitalized')).toBe('Capitalized');
    });

    it('should handle single letter input', () => {
        expect(capitalize('a')).toBe('A');
    });
});
