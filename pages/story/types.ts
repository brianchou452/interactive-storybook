export interface Option {
    text: string;
    next: string;
    position: Position;
    requireItems?: string[];
}

export interface Position { x: number | string; y: number | string }