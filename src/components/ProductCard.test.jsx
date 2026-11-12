import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

function renderProductCard(releaseYear) {
  return render(
    <MemoryRouter>
      <ProductCard
        product={{
          id: 1,
          name: 'Equipment',
          releaseYear,
        }}
      />
    </MemoryRouter>
  );
}

test('แสดงปีเปิดตัวเมื่อมีข้อมูล', () => {
  renderProductCard(2024);

  expect(screen.getByText('ปีเปิดตัว: 2024')).toBeInTheDocument();
});

test('แสดงข้อความเมื่อไม่มีปีเปิดตัว', () => {
  renderProductCard(null);

  expect(screen.getByText('ปีเปิดตัว: ไม่ระบุปี')).toBeInTheDocument();
});
