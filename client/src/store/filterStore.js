// [TV4] Quản lý lưu trữ bộ lọc tìm kiếm, khoảng giá của trang chủ (Zustand / Event-based store)
import { useState, useEffect } from 'react';

// Khởi tạo state bộ lọc mặc định
let filterState = {
  keyword: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
  sortBy: 'latest', // 'latest', 'price_asc', 'price_desc'
};

const listeners = new Set();

export const filterStore = {
  getState: () => filterState,
  setState: (newState) => {
    filterState = { ...filterState, ...newState };
    listeners.forEach((listener) => listener(filterState));
  },
  setKeyword: (keyword) => {
    filterStore.setState({ keyword, page: 1 });
  },
  setPriceRange: (minPrice, maxPrice) => {
    filterStore.setState({ minPrice, maxPrice, page: 1 });
  },
  setPage: (page) => {
    filterStore.setState({ page });
  },
  resetFilters: () => {
    filterStore.setState({
      keyword: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      sortBy: 'latest',
    });
  },
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// Hook React dễ dàng sử dụng trong component
export function useFilterStore() {
  const [state, setState] = useState(filterStore.getState());

  useEffect(() => {
    const unsubscribe = filterStore.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    setKeyword: filterStore.setKeyword,
    setPriceRange: filterStore.setPriceRange,
    setPage: filterStore.setPage,
    resetFilters: filterStore.resetFilters,
  };
}

export default filterStore;
