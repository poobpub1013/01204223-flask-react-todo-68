import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import TodoItem from '../TodoItem.jsx'

const baseTodo = {
  id: 1,
  title: 'Sample Todo',
  done: false,
  comments: [],
};

describe('TodoItem', () => {

  it('renders with no comments correctly', () => {
    render(
      <TodoItem
        todo={baseTodo}
        toggleDone={() => {}}
        deleteTodo={() => {}}
        addNewComment={() => {}}
      />
    );

    expect(screen.getByText('Sample Todo')).toBeInTheDocument();

    // ✅ Step 1: ต้องแสดง No comments
    expect(screen.getByText('No comments')).toBeInTheDocument();
  });


  it('does not show no comments message when it has a comment', () => {
    const todoWithComment = {
      ...baseTodo,
      comments: [
        { id: 1, message: 'First comment' },
      ]
    };

    render(
      <TodoItem
        todo={todoWithComment}
        toggleDone={() => {}}
        deleteTodo={() => {}}
        addNewComment={() => {}}
      />
    );

    // ✅ Step 2: ต้องไม่เห็น No comments
    expect(screen.queryByText('No comments')).not.toBeInTheDocument();
  });


  it('renders with comments correctly', () => {
    const todoWithComment = {
      ...baseTodo,
      comments: [
        { id: 1, message: 'First comment' },
        { id: 2, message: 'Another comment' },
      ]
    };

    render(
      <TodoItem
        todo={todoWithComment}
        toggleDone={() => {}}
        deleteTodo={() => {}}
        addNewComment={() => {}}
      />
    );

    expect(screen.getByText('Sample Todo')).toBeInTheDocument();
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Another comment')).toBeInTheDocument();

    // ✅ Step 3: ต้องแสดงจำนวน comment (ใช้ regex)
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });


  it('calls toggleDone when Toggle button is clicked', async () => {
    const mockToggle = vi.fn();

    render(
      <TodoItem
        todo={baseTodo}
        toggleDone={mockToggle}
        deleteTodo={() => {}}
        addNewComment={() => {}}
      />
    );

    const toggleButton = screen.getByText('Toggle');
    await userEvent.click(toggleButton);

    expect(mockToggle).toHaveBeenCalledWith(1);
  });


  it('calls deleteTodo when delete button is clicked', async () => {
    const mockDelete = vi.fn();

    render(
      <TodoItem
        todo={baseTodo}
        toggleDone={() => {}}
        deleteTodo={mockDelete}
        addNewComment={() => {}}
      />
    );

    const deleteButton = screen.getByText('❌');
    await userEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledWith(1);
  });

});