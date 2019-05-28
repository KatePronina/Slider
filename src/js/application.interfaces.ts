interface Settings {
    parentId: string;
    interval?: boolean;
    minValue?: number;
    maxValue?: number;
    value?: number;
    step?: number;
    horizontal?: boolean;
    hint?: boolean;
    configure?: boolean;
}

export default Settings;