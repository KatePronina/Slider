interface Settings {
    parentId: string;
    type?: string;
    minValue?: number;
    maxValue?: number;
    value?: number | number[];
    step?: number;
    direction?: string;
    hint?: string;
    configure?: string;
}

export default Settings;