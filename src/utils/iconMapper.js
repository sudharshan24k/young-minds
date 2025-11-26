import { Palette, PenTool, Video, Cpu, Star } from 'lucide-react';

const iconMap = {
    Palette,
    PenTool,
    Video,
    Cpu,
    Star
};

export const getIcon = (iconName) => {
    return iconMap[iconName] || Star;
};
