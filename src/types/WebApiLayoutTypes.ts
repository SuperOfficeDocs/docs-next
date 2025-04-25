import type { Item } from "../types/WebAPITypes";


export interface indexDictionaryProps {
    Class: number[];
    Constructor: number[];
    Method : number[];
    Property: number[];
    Field: number[];
    Namespace: number[];
}

export interface headingsListProps {
    Class: headingsItem[];
    Constructor: headingsItem[];
    Method : headingsItem[];
    Property: headingsItem[];
    Field: headingsItem[];
    Interface : headingsItem[]
}

interface headingsItem {
    text : string;
    slug : string;
}

export interface namespaceClassifiedDataProps {
    Class: namespaceClassifiedDataItem [];
    Interface: namespaceClassifiedDataItem [];
}

interface namespaceClassifiedDataItem {
    uid : string;
    id : string;
    summary :string;
}


