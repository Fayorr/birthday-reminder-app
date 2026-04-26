const { isLeapYear } = require('../services/cronService');

describe('Cron Service - Leap Year Logic', () => {
	test('should return true for standard leap years', () => {
		expect(isLeapYear(2024)).toBe(true);
		expect(isLeapYear(2028)).toBe(true);
	});

	test('should return true for century leap years', () => {
		expect(isLeapYear(2000)).toBe(true);
		expect(isLeapYear(2400)).toBe(true);
	});

	test('should return false for standard non-leap years', () => {
		expect(isLeapYear(2023)).toBe(false);
		expect(isLeapYear(2025)).toBe(false);
		expect(isLeapYear(2026)).toBe(false);
	});

	test('should return false for century non-leap years', () => {
		expect(isLeapYear(1900)).toBe(false);
		expect(isLeapYear(2100)).toBe(false);
	});
});
