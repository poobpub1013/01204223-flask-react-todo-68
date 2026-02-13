import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App.jsx'

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

describe('App', () => {

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
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

    render(<App />);

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

    render(<App />);

    // ตอนแรกต้องยังไม่ done
    expect(await screen.findByText('First todo'))
      .not.toHaveClass('done');

    const toggleButtons =
      await screen.findAllByRole('button', { name: /toggle/i });

    toggleButtons[0].click();

    // หลัง toggle ต้องเป็น done
    expect(await screen.findByText('First todo'))
      .toHaveClass('done');

    // ตรวจสอบว่าเรียก fetch ถูกต้อง
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringMatching(/1\/toggle/),
      { method: 'PATCH' }
    );
  });

});