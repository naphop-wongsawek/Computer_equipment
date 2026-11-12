import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { getProduct, getProducts } from '../api/backend';

jest.mock('../api/backend', () => ({
  getProduct: jest.fn(),
  getProducts: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  getProducts.mockResolvedValue([
    { id: 1, name: 'Equipment 1', rating: 7 },
    { id: 2, name: 'Equipment 2', rating: null },
  ]);
  getProduct.mockImplementation(id => Promise.resolve({
    memberRating: id === 1 ? 8.5 : null,
    memberVoteCount: id === 1 ? 2 : 0,
  }));
});

test('แสดงคะแนนจากสมาชิกในอุปกรณ์แนะนำ แทนคะแนนทีมงานหรือข้อความไม่มีคะแนน', async () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(await screen.findByText('★ 8.5 (2)')).toBeInTheDocument();
  expect(screen.getByText('ยังไม่มีคะแนน')).toBeInTheDocument();
  expect(getProduct).toHaveBeenCalledTimes(2);
  expect(getProduct).toHaveBeenNthCalledWith(1, 1);
  expect(getProduct).toHaveBeenNthCalledWith(2, 2);
});
