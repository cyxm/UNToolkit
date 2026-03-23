export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  palette: {
    primary: string;
    background: string;
    text: string;
    divider: string;
  };
  customShadows: {
    header: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  palette: {
    primary: '#1976d2',
    background: '#ffffff',
    text: '#000000',
    divider: 'rgba(0, 0, 0, 0.12)'
  },
  customShadows: {
    header: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
};

export const darkTheme: Theme = {
  mode: 'dark',
  palette: {
    primary: '#90caf9',
    background: '#121212',
    text: '#ffffff',
    divider: 'rgba(255, 255, 255, 0.12)'
  },
  customShadows: {
    header: '0 2px 4px rgba(255, 255, 255, 0.1)'
  }
};
