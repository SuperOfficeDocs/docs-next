/**
 * Minimal representation of a single item in a ManagedReference YAML.
 * Used by CRMScript, WebAPI, and other reference collections.
 */
export interface YamlManagedReferenceItem {
  uid: string;
  commentId?: string | null;
  id?: string | null;   // Optional, may be missing
  parent?: string | null;
  children?: string[] | null;
  name?: string | null;
  nameWithType?: string | null;
  fullName?: string | null;
  type: string;   // "Class", "Method", "Namespace", "Enum"
  summary?: string | null;
  remarks?: string | null;
  example?: string[] | null;

  // Syntax details (methods, properties, etc.)
  syntax?: {
    content?: string | null;
    parameters?: {
      id?: string | null;
      type?: string;
      description?: string | null;
    }[] | null;
    return?: {
      type?: string;
      description?: string | null;
    } | null;
  } | null;

  // Hierarchy/relationships
  implements?: string[] | null;
  inheritance?: string[] | null;
  derivedClasses?: string[] | null;

  // Optional WebAPI-specific fields
  assemblies?: string[] | null;
  namespace?: string | null;
  langs?: string[] | null;

  // Catch‑all for `so.*` custom fields
  so?: Record<string, unknown>;
}

/**
 * Reference entries are used to resolve UIDs in children/parameters/returns.
 */
export interface YamlManagedReferenceReference {
  uid: string;
  commentId?: string | null;
  isExternal?: boolean | null;
  name?: string | null;
  nameWithType?: string | null;
  fullName?: string | null;
  href?: string | null;
  summary?: string | null;
  type?: string;
  spec?: Record<string, unknown>;
}

/**
 * Entire ManagedReference YAML structure.
 */
export interface YamlManagedReference {
  items: YamlManagedReferenceItem[];
  references?: YamlManagedReferenceReference[] | null;
}

/**
 * Grouping type for namespace views (used in CRMScript + WebAPI).
 * Key = type (Class/Enum/etc.), Value = list of items.
 */
export type YamlNamespaceData = Record<string, YamlManagedReferenceReference[]>;
