// client/src/App.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import App from './App';

// Mock the axios library to prevent real API calls during the test
jest.mock('axios');

// A helper function to wrap our App in all the necessary providers
const renderApp = () => {
  return render(
    <SocketProvider>
      <CartProvider>
        <Router>
          <App />
      </Router>
      </CartProvider>
    </SocketProvider>
  );
};

describe('App Component', () => {
  test('should render the login and registration forms for a logged-out user', () => {
    // Render the App component with all its providers
    renderApp();

    // Check if key elements of the AuthPage are visible
    // We look for the headings of the Login and Register components
    const loginHeading = screen.getByRole('heading', { name: /Login with Password/i });
    const registerHeading = screen.getByRole('heading', { name: /Register/i });

    // Assert that these elements are in the document
    expect(loginHeading).toBeInTheDocument();
    expect(registerHeading).toBeInTheDocument();
  });
});