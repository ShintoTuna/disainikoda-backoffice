import { Classes } from '@blueprintjs/core';
import { useState } from 'react';

export enum Theme {
    dark = 'dark',
    light = 'light',
}

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = window.localStorage.getItem('om-theme');

        return savedTheme ? Theme[savedTheme as Theme] : Theme.dark;
    });

    const toggleTheme = () => {
        const newTheme = theme === Theme.dark ? Theme.light : Theme.dark;

        setTheme(newTheme);
        window.localStorage.setItem('om-theme', newTheme);
    };

    const themeClass = theme === Theme.dark ? Classes.DARK : '';

    return { toggleTheme, theme, themeClass };
};
