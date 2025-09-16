export interface ManagedReferenceType {
  items: Item[];
  references: Reference[];
}

export interface Item {
  uid: string;
  commentId: string;
  id: string;
  alias?:string[];
  parent?: string;
  children?: string[];
  langs: string[];
  name: string;
  nameWithType: string;
  fullName: string;
  type: string;
  source?: {
    repo?:String;
    branch?: string;
    revision? : String;
    path?: string;
    startLine?: string;
    endLine?:string;
    isExternal?: boolean;
  };
  url?:string;
  assemblies: string[];
  namespace?: string;
  summary?: string;
  remarks?: string;
  syntax?: Syntax;
  example?: string[];
  inheritance?: string[];
  inheritedMembers?:string[];
  derivedClasses?: string[];
  implements?: string[];
  overload?:string;
  "modifiers.csharp"?: string[];
  "modifiers.vb"?: string[];
}

export interface Syntax {
  content: string;
  "content.vb"?: string;
  parameters?: Parameter[];
  return?: {
    type: string;
    description: string;
  };
}

export interface Parameter {
  id: string;
  type: string;
  description: string;
}


export interface Reference {
  uid: string;
  commentId: string;
  parent?: string;
  isExternal: boolean;
  name: string;
  nameWithType: string;
  fullName: string;
  definition?: string;
  href?: string;
  "nameWithType.Vb"?: string;
  "fullName.Vb"?: string;
  "name.Vb"?: string;
  "spec.csharp"?: SpecDetail[];
  "spec.vb"?: SpecDetail[];
}


export interface SpecDetail {
  uid?: string;
  name: string;
  nameWithType: string;
  fullName: string;
  isExternal?: boolean;
}
