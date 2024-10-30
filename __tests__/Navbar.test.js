import { render, screen } from '@testing-library/react';
import Navbar from '../src/app/components/header';

test('renders Navbar with project title', () => {
  render(<Navbar />);
  expect(screen.getByText('MailMinds')).toBeInTheDocument();
});
