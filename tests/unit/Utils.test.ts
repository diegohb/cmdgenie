import { GetOS } from '../../src/types';

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
});