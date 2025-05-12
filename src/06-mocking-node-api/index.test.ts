import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const mockPath = 'test.txt';
    const mockFullPath = '/mock/full/path/test.txt';
    (join as jest.Mock).mockReturnValue(mockFullPath);

    await readFileAsynchronously(mockPath);

    expect(join).toHaveBeenCalledWith(__dirname, mockPath);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously('test.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockContent = Buffer.from('File content');
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(mockContent);

    const result = await readFileAsynchronously('test.txt');

    expect(result).toBe('File content');
  });
});

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    jest.advanceTimersByTime(timeout - 1);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);

    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);

    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(interval * 3);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});