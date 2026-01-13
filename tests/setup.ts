// Jest test setup file
// This file runs before each test suite

// Mock fetch globally for all tests
global.fetch = jest.fn();

// Set up test environment variables if needed
process.env.NODE_ENV = 'test';

// Add any global test utilities here