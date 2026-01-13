import { GetOS, GetShell } from '../../src/types';

// Mock os module
jest.mock('os', () => ({
    platform: jest.fn()
}));

import * as os from 'os';

const mockedOs = os as jest.Mocked<typeof os>;

describe('Utility Functions', () => {
    describe('GetOS', () => {
        it('should return win32 for Windows', () => {
            mockedOs.platform.mockReturnValue('win32');
            expect(GetOS()).toBe('win32');
        });

        it('should return darwin for macOS', () => {
            mockedOs.platform.mockReturnValue('darwin');
            expect(GetOS()).toBe('darwin');
        });

        it('should return linux for Linux', () => {
            mockedOs.platform.mockReturnValue('linux');
            expect(GetOS()).toBe('linux');
        });

        it('should return the platform value', () => {
            mockedOs.platform.mockReturnValue('aix');
            expect(GetOS()).toBe('aix');
        });
    });

    describe('GetShell', () => {
        beforeEach(() => {
            // Reset mocks
            delete process.env.SHELL;
            delete process.env.PSModulePath;
        });

        it('should return powershell for Windows when PSModulePath is set', () => {
            mockedOs.platform.mockReturnValue('win32');
            process.env.PSModulePath = '/some/path';
            expect(GetShell()).toBe('powershell');
        });

        it('should return cmd for Windows when PSModulePath is not set', () => {
            mockedOs.platform.mockReturnValue('win32');
            expect(GetShell()).toBe('cmd');
        });

        it('should return shell name from SHELL env var on Unix-like systems', () => {
            mockedOs.platform.mockReturnValue('linux');
            process.env.SHELL = '/bin/bash';
            expect(GetShell()).toBe('bash');
        });

        it('should return bash as default on Unix-like systems when SHELL is not set', () => {
            mockedOs.platform.mockReturnValue('darwin');
            expect(GetShell()).toBe('bash');
        });

        it('should handle full shell path', () => {
            mockedOs.platform.mockReturnValue('linux');
            process.env.SHELL = '/usr/bin/zsh';
            expect(GetShell()).toBe('zsh');
        });
    });
});