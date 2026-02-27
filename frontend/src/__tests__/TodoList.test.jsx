import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import TodoList from '../TodoList.jsx'

// ✅ mock useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

const mockResponse = (body, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(body),
  });

// ---------------------------
// Test data
// ---------------------------

const todoItem1 = { 
  id: 1, 
  title: 'First todo', 
  done: false, 
  comments: [] 
};

const todoItem2 = { 
  id: 2, 
  title: 'Second todo', 
  done: false, 
  comments: [
    { id: 1, message: 'First comment' },
    { id: 2, message: 'Second comment' },
  ] 
};

const originalTodoList = [
  todoItem1,
  todoItem2,
];

describe('TodoList', () => {

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());

    // ✅ mock ค่า useAuth
    useAuth.mockReturnValue({
      username: 'testuser',
      accessToken: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  // --------------------------------
  // Render test
  // --------------------------------
  it('renders correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      mockResponse(originalTodoList)
    );

    render(<TodoList />);

    expect(await screen.findByText('First todo')).toBeInTheDocument();
    expect(await screen.findByText('Second todo')).toBeInTheDocument();
    expect(await screen.findByText('First comment')).toBeInTheDocument();
    expect(await screen.findByText('Second comment')).toBeInTheDocument();
  });

  // --------------------------------
  // Toggle done test
  // --------------------------------
  it('toggles done on a todo item', async () => {

    const toggledTodoItem1 = { ...todoItem1, done: true };

    global.fetch
      // โหลดรายการตอนแรก
      .mockImplementationOnce(() => mockResponse(originalTodoList))
      // ตอนกด toggle
      .mockImplementationOnce(() => mockResponse(toggledTodoItem1));

    render(<TodoList />);

    // ตอนแรกต้องยังไม่ done
    expect(await screen.findByText('First todo'))
      .not.toHaveClass('done');

    const toggleButtons =
      await screen.findAllByRole('button', { name: /toggle/i });

    toggleButtons[0].click();

    // หลัง toggle ต้องเป็น done
    expect(await screen.findByText('First todo'))
      .toHaveClass('done');

    // ✅ เช็ค fetch แบบรองรับ headers
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringMatching(/1\/toggle/),
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token',
        }),
      })
    );
  });

});