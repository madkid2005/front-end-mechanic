'use client'; 
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Bootstrap({ children }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return <>{children}</>;
}