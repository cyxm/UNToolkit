export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  palette: {
    primary: string;
    background: string;
    text: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  palette: {
    primary: '#1976d2',
    background: '#ffffff',
    text: '#000000'
  }
};

export const darkTheme: Theme = {
  mode: 'dark',
  palette: {
    primary: '#90caf9',
    background: '#121212',
    text: '#ffffff'
  }
};
