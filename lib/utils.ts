export { cn } from "cn";

export const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
};

export const generateColor = (name?: string) => {
    if (!name) return "hsl(199.5, 89.1%, 48.2%)";

    const normalizedName = name.trim().toLowerCase();

    let hash = 0;
    for (let i = 0; i < normalizedName.length; i++) {
        hash = normalizedName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
};
