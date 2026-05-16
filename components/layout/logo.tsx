'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
    theme?: 'light' | 'dark';
}

export function Logo({ className, width = 150, height = 40, priority = false, theme }: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by waiting until mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ width, height }} className={cn("bg-transparent", className)} />;
    }

    const isDarkMode = theme ? theme === 'dark' : resolvedTheme === 'dark';

    // Dark Theme: light-logo.png
    // Light Theme: dark-logo.png
    const src = isDarkMode
        ? "/light-logo.png"
        : "/dark-logo.png";

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <Image
                src={src}
                alt="Yusrflow Logo"
                width={width}
                height={height}
                className="object-contain"
                priority={priority}
            />
        </div>
    );
}
