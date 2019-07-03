interface Settings {
    parentId: string;
    type?: string;
    minValue?: number;
    maxValue?: number;
    value?: number | number[];
    step?: number;
    direction?: string;
    hint?: boolean;
    scale?: boolean;
    configuration?: boolean;
}

interface FullSettings {
    parentId: string;
    type: string;
    minValue: number;
    maxValue: number;
    value: number | number[];
    step: number;
    direction: string;
    hint: boolean;
    scale: boolean;
    configuration: boolean;
}

export {Settings, FullSettings};