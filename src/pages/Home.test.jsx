import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { getProducts } from '../api/backend';

jest.mock('../api/backend', () => ({
  getProducts: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  getProducts.mockResolvedValue([
    { id: 1, name: 'Equipment 1', rating: 7, memberRating: 8.5, memberVoteCount: 2 },
    { id: 2, name: 'Equipment 2', rating: null, memberRating: null, memberVoteCount: 0 },
  ]);
});

test('แสดงคะแนนจากสมาชิกในอุปกรณ์แนะนำ แทนคะแนนทีมงานหรือข้อความไม่มีคะแนน', async () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(await screen.findByText('★ 8.5 (2)')).toBeInTheDocument();
  expect(screen.getByText('ยังไม่มีคะแนน')).toBeInTheDocument();
  expect(getProducts).toHaveBeenCalledTimes(1);
});
