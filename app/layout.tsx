'use client';

import { Provider } from 'react-redux';
import { store } from '../lib/store';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Navbar />
          <main className="container-fluid mx-auto">{children}</main>
        </Provider>
      </body>
    </html>
  );
}