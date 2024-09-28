import {expect, test, describe} from 'vitest'
import formatDate from '../utils/dateHandling'

describe('formatDate', () => {
    test('formats date correctly', () => {
        const testDate = '2023-04-15T12:00:00Z';
        const formattedDate = formatDate(testDate);
        expect(formattedDate).toBe('April 15, 2023')
    });

    test('handle different date inputs', () => {
        const testCases = [
            { input: '2022-01-01', expected: 'January 1, 2022'},
            { input: '2023-12-31T23:59:59Z', expected: 'December 31, 2023'},
            { input: '2024-02-29', expected: 'February 29, 2024'}, // Leap year
        ]
        
        testCases.forEach(({input, expected}) => {
            expect(formatDate(input)).toBe(expected);
        });
    })

    test('handles date at UTC midnight', () => {
        const testDate = '2023-12-31';
        const formattedDate = formatDate(testDate);
        expect(formattedDate).toBe('December 31, 2023');
      });

    test('thows error for invalid date', () => {
        expect(() => formatDate('invalid-date')).toThrow();
    });
})