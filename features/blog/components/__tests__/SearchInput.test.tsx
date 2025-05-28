import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
  it('renders the input field', () => {
    render(<SearchInput onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search posts...');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls onSearch with the query when input changes', () => {
    const mockOnSearch = jest.fn();
    render(<SearchInput onSearch={mockOnSearch} />);
    const inputElement = screen.getByPlaceholderText('Search posts...');

    fireEvent.change(inputElement, { target: { value: 'test query' } });
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('updates input value when user types', () => {
    render(<SearchInput onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search posts...') as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: 'hello' } });
    expect(inputElement.value).toBe('hello');
  });
});
