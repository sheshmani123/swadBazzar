import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './Verify.css';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const success = searchParams.get('success');

  console.log(success);
  console.log(orderId);

  return (
    <div>
      <p>Order ID: {orderId}</p>
      <p>Payment Status: {success}</p>
    </div>
  );
};

export default Verify;
