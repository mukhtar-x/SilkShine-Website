export const themes = {
    light: {
        background: 'bg-white',
        text: 'text-gray-900',
        primary: 'text-indigo-600',
        secondary: 'text-purple-600',
        accent: 'text-pink-600',
    },
    dark: {
        background: 'bg-gray-900',
        text: 'text-white',
        primary: 'text-indigo-400',
        secondary: 'text-purple-400',
        accent: 'text-pink-400',
    },
};

export type ThemeMode = 'light' | 'dark';
