export {};

declare global {
  interface Window {
    pagefind: {
      init: () => Promise<void>;
      search: (query: string) => Promise<{
        results: {
          data: () => Promise<{
            url: string;
            excerpt: string;
            meta: Record<string, string>;
          }>;
        }[];
      }>;
    };
  }
}
