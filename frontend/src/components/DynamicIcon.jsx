import { icons } from 'lucide-react';

export default function DynamicIcon({name, className}) {
    const LucideIcon = icons[name];
    return <LucideIcon className={className} />;
}
