import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ClinicCare header', () => {
  render(<App />);
  const linkElement = screen.getByText(/ClinicCare/i);
  expect(linkElement).toBeInTheDocument();
});
