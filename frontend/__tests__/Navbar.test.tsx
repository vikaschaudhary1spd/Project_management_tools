import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import { AuthProvider } from '../src/contexts/AuthContext';

// Mock the API client
jest.mock('../src/api/client', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('Navbar Component', () => {
  it('does not render when unauthenticated', () => {
    // AuthContext defaults to unauthenticated
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
