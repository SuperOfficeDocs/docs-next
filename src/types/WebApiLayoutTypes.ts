export interface indexDictionaryProps {
    [key: string]: number[]; 
}

export interface headingsListProps {
  [key: string]: headingsItem[]; 
}

interface headingsItem {
    text : string;
    slug : string;
}

export interface namespaceClassifiedDataProps {
    [key: string]: namespaceClassifiedDataItem [];
}

interface namespaceClassifiedDataItem {
    uid : string;
    id : string;
    summary :string;
}


