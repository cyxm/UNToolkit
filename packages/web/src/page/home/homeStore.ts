import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path: string;
}

export interface HomeState {
  themeMode: 'light' | 'dark';
  selectedMenuItem: string;
  menuItems: MenuItem[];
  sidebarCollapsed: boolean;

  setThemeMode: (mode: 'light' | 'dark') => void;
  setSelectedMenuItem: (id: string) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  themeMode: 'light',
  selectedMenuItem: 'db',
  menuItems: [
    {
      id: 'graph',
      name: 'Graph模块',
      icon: 'BarChartIcon',
      path: 'graph'
    }
  ],
  sidebarCollapsed: false,

  setThemeMode: (mode) => set({ themeMode: mode }),
  setSelectedMenuItem: (id) => set({ selectedMenuItem: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleTheme: () => set((state) => ({
    themeMode: state.themeMode === 'light' ? 'dark' : 'light'
  }))
}));
