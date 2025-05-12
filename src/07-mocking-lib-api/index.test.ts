import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  let mockGet: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as any);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  test('should create instance with provided base url', async () => {
    mockGet.mockResolvedValue({ data: {} });

    throttledGetDataFromApi('/posts/1');
    jest.advanceTimersByTime(THROTTLE_TIME);
    await Promise.resolve(); // Let promises flush

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockData = { id: 1, title: 'Post Title' };
    mockGet.mockResolvedValue({ data: mockData });

    throttledGetDataFromApi('/posts/1');
    jest.advanceTimersByTime(THROTTLE_TIME);
    await Promise.resolve();

    expect(mockGet).toHaveBeenCalledWith('/posts/1');
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test('should throttle multiple calls within throttle time', async () => {
    const mockData = { id: 2, title: 'Another Post' };
    mockGet.mockResolvedValue({ data: mockData });

    throttledGetDataFromApi('/posts/2');
    throttledGetDataFromApi('/posts/2'); // Should be throttled

    jest.advanceTimersByTime(THROTTLE_TIME);
    await Promise.resolve();

    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
