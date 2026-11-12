import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductActions from './ProductActions';
import { useAuth } from '../auth/AuthContext';
import {
  putVote,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../api/backend';

jest.mock('../auth/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../api/backend', () => ({
  putVote: jest.fn(),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
  getWishlist: jest.fn()
}));

function renderProductActions() {
  return render(
    <MemoryRouter>
      <ProductActions productId={1} />
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();

  useAuth.mockReturnValue({
    isLoggedIn: true,
    token: 'test-token'
  });

  getWishlist.mockResolvedValue({
    items: []
  });

  putVote.mockResolvedValue({});
  addToWishlist.mockResolvedValue({});
  removeFromWishlist.mockResolvedValue({});
});

test('แสดงปุ่มให้คะแนนสินค้า 1-10', () => {
  renderProductActions();

  for (let score = 1; score <= 10; score++) {
    expect(
      screen.getByRole('button', { name: String(score) })
    ).toBeInTheDocument();
  }
});

test('โหลด Wishlist เมื่อผู้ใช้เข้าสู่ระบบ', async () => {
  renderProductActions();

  await waitFor(() => {
    expect(getWishlist).toHaveBeenCalledWith('test-token');
  });
});

test('ให้คะแนนสินค้าและแสดงข้อความเมื่อบันทึกสำเร็จ', async () => {
  const user = userEvent.setup();

  renderProductActions();

  await user.click(
    screen.getByRole('button', { name: '5' })
  );

  await waitFor(() => {
    expect(putVote).toHaveBeenCalledWith(1, 5, 'test-token');
  });

  expect(
    await screen.findByText('บันทึกคะแนนเรียบร้อย')
  ).toBeInTheDocument();
});

test('เพิ่มสินค้าเข้า Wishlist ได้', async () => {
  const user = userEvent.setup();

  renderProductActions();

  await user.click(
    screen.getByRole('button', { name: /เพิ่มเข้ารายการที่อยากดู/ })
  );

  await waitFor(() => {
    expect(addToWishlist).toHaveBeenCalledWith(1, 'test-token');
  });

  expect(
    await screen.findByText('เพิ่มสินค้าเข้ารายการที่อยากดูแล้ว')
  ).toBeInTheDocument();
});

test('ลบสินค้าออกจาก Wishlist ได้', async () => {
  const user = userEvent.setup();

  getWishlist.mockResolvedValue({
    items: [{ id: 1 }]
  });

  renderProductActions();

  const wishlistButton = await screen.findByRole('button', {
    name: /อยู่ในรายการที่อยากดูแล้ว/
  });

  await user.click(wishlistButton);

  await waitFor(() => {
    expect(removeFromWishlist).toHaveBeenCalledWith(1, 'test-token');
  });

  expect(
    await screen.findByText('ลบสินค้าออกจากรายการที่อยากดูแล้ว')
  ).toBeInTheDocument();
});

test('ผู้ใช้ที่ไม่ได้เข้าสู่ระบบต้องเห็นลิงก์ Login', () => {
  useAuth.mockReturnValue({
    isLoggedIn: false,
    token: null
  });

  renderProductActions();

  expect(
    screen.getByRole('link', { name: 'เข้าสู่ระบบ' })
  ).toHaveAttribute('href', '/login');
});