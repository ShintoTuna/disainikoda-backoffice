import { Classes } from '@blueprintjs/core';
import { useState } from 'react';

export enum Theme {
    dark = 'dark',
    light = 'light',
}

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = window.localStorage.getItem('om-theme');
        const initialTheme = savedTheme ? Theme[savedTheme as Theme] : Theme.dark;

        document.body.classList.add(initialTheme);

        return initialTheme;
    });

    const toggleTheme = () => {
        document.body.classList.remove(theme);
        const newTheme = theme === Theme.dark ? Theme.light : Theme.dark;

        setTheme(newTheme);
        document.body.classList.add(newTheme);
        window.localStorage.setItem('om-theme', newTheme);
    };

    const themeClass = theme === Theme.dark ? Classes.DARK : '';

    return { toggleTheme, theme, themeClass };
};
