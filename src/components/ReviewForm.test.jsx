import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './ReviewForm';

test('ยังไม่พิมพ์อะไร ปุ่มส่งต้องกดไม่ได้', () => {
  render(
    <ReviewForm productTitle="GeForce RTX 4060" onSubmit={jest.fn()} />
  );

  expect(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  ).toBeDisabled();
});

test('พิมพ์แล้วกดส่ง ต้องเรียก onSubmit และแสดงข้อความขอบคุณ', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn().mockResolvedValue();

  render(
    <ReviewForm productTitle="GeForce RTX 4060" onSubmit={onSubmit} />
  );

  await user.type(
    screen.getByPlaceholderText(/ใช้งานแล้วรู้สึกอย่างไร/),
    'ใช้งานได้ดีมาก ประสิทธิภาพคุ้มราคา'
  );

  await user.click(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  );

  expect(onSubmit).toHaveBeenCalledWith(
    'ใช้งานได้ดีมาก ประสิทธิภาพคุ้มราคา'
  );

  expect(
    await screen.findByText(/ขอบคุณสำหรับรีวิว GeForce RTX 4060/)
  ).toBeInTheDocument();
});

test('ถ้า onSubmit โยน Error ต้องแสดงข้อความและฟอร์มยังอยู่', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn().mockRejectedValue(
    new Error('รีวิวสั้นเกินไป')
  );

  render(
    <ReviewForm productTitle="GeForce RTX 4060" onSubmit={onSubmit} />
  );

  await user.type(
    screen.getByPlaceholderText(/ใช้งานแล้วรู้สึกอย่างไร/),
    'สั้นไป'
  );

  await user.click(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  );

  expect(
    await screen.findByText('รีวิวสั้นเกินไป')
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  ).toBeInTheDocument();

  expect(
    screen.queryByText(/ขอบคุณสำหรับรีวิว/)
  ).not.toBeInTheDocument();
});