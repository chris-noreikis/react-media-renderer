import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaRenderer from './index';

describe('MediaRenderer', () => {
  it('renders without crashing', () => {
    render(<MediaRenderer src="test.jpg" />);
    expect(screen.getByText('foobar')).toBeInTheDocument();
  });

  it('accepts src prop', () => {
    const testSrc = 'https://example.com/test.jpg';
    render(<MediaRenderer src={testSrc} />);
    // Component currently renders "foobar" regardless of src
    expect(screen.getByText('foobar')).toBeInTheDocument();
  });
});