import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import CreateBundlePage from './CreateBundlePage';

// Mock axios
jest.mock('axios');

describe('CreateBundlePage', () => {
  it('should render without crashing even when the API call fails', async () => {
    // Mock the API call to simulate a failure
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch products'));

    render(
      <>
        <CreateBundlePage />
        <ToastContainer />
      </>
    );

    // Check that the component still renders the main heading
    expect(screen.getByRole('heading', { name: /Create a "Shop the Look" Bundle/i })).toBeInTheDocument();

    // Check that no products are displayed
    expect(screen.queryByText(/Select Products to Include:/i)).toBeInTheDocument();
    
    // Ensure no product images are rendered, which would indicate the .map function was called on an undefined value
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
