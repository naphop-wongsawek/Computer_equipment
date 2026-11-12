
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Products from './Products';
import { getProducts } from '../api/backend';
import { products } from '../data/data';

jest.mock('../api/backend', () => ({
  getProducts: jest.fn(),
}));

function renderProducts() {
  return render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );
}

const productCount = (_, element) =>
  element?.tagName === 'P' && element.textContent === 'พบ 10 จาก 10 รายการ';

beforeEach(() => {
  getProducts.mockResolvedValue(products);
});

test('แสดงรายการอุปกรณ์คอมพิวเตอร์ทั้งหมดจาก backend', async () => {
  renderProducts();

  expect(
    screen.getByText('ค้นหาอุปกรณ์ที่ใช่')
  ).toBeInTheDocument();

  await screen.findByText(productCount);
  expect(screen.getByText(productCount)).toBeInTheDocument();

  expect(screen.getAllByRole('link')).toHaveLength(10);
});

test('ค้นหาสินค้าจากชื่อรุ่นหรือยี่ห้อได้', async () => {
  const user = userEvent.setup();
  renderProducts();
  await screen.findByText(productCount);

  const searchInput = screen.getByPlaceholderText(
    'ค้นหาชื่อรุ่นหรือยี่ห้อ...'
  );

  // ค้นหาจากชื่อรุ่น
  await user.type(searchInput, 'Ryzen');

  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByText('Ryzen 5 7600')).toBeInTheDocument();

  // ล้างคำค้นหา แล้วค้นหาจากยี่ห้อ
  await user.clear(searchInput);
  await user.type(searchInput, 'NVIDIA');

  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByText('GeForce RTX 4060')).toBeInTheDocument();
});

test('เลือกหมวดหมู่แล้วต้องแสดงเฉพาะสินค้าหมวดนั้น', async () => {
  const user = userEvent.setup();
  renderProducts();
  await screen.findByText(productCount);

  await user.click(
    screen.getByRole('button', { name: 'ซีพียู' })
  );

  // มี CPU อยู่ 2 รายการ
  expect(screen.getAllByRole('link')).toHaveLength(2);

  expect(screen.getByText('Ryzen 5 7600')).toBeInTheDocument();
  expect(screen.getByText('Core i5-13400F')).toBeInTheDocument();

  // กลับไปแสดงสินค้าทุกหมวด
  await user.click(
    screen.getByRole('button', { name: 'ทุกหมวด' })
  );

  expect(screen.getAllByRole('link')).toHaveLength(10);
});

test('ค้นหาสินค้าที่ไม่มีอยู่ ต้องแสดงข้อความไม่พบอุปกรณ์', async () => {
  const user = userEvent.setup();
  renderProducts();
  await screen.findByText(productCount);

  await user.type(
    screen.getByPlaceholderText('ค้นหาชื่อรุ่นหรือยี่ห้อ...'),
    'ไม่มีสินค้านี้'
  );

  expect(
    screen.getByText('ไม่พบอุปกรณ์ที่ค้นหา ลองคำอื่นดู')
  ).toBeInTheDocument();

  expect(screen.queryAllByRole('link')).toHaveLength(0);
});
