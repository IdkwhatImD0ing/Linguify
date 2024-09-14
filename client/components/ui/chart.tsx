import React from 'react';
import { ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

export type ChartConfig = {
    [key: string]: {
        label: string;
        color: string;
    };
    };

    interface ChartContainerProps {
    children: React.ReactNode;
    config: ChartConfig;
    className?: string;
    }

    export const ChartContainer: React.FC<ChartContainerProps> = ({ children, className }) => (
    <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
        {children}
        </ResponsiveContainer>
    </div>
    );

    export const ChartTooltip: React.FC<TooltipProps<any, any>> = (props) => (
    <Tooltip {...props} />
    );

    interface ChartTooltipContentProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    }

    export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-md">
            <p className="font-bold">{label}</p>
            <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
        );
    }
    return null;
};