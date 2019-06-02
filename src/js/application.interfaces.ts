interface Settings {
    parentId: string;
    type?: string;
    minValue?: number;
    maxValue?: number;
    value?: number | number[];
    step?: number;
    direction?: string;
    hint?: string;
    scale?: string;
    configure?: string;
}

interface FullSettings {
    parentId: string;
    type: string;
    minValue: number;
    maxValue: number;
    value: number | number[];
    step: number;
    direction: string;
    hint: string;
    scale: string;
    configure: string;
}

export {Settings, FullSettings};