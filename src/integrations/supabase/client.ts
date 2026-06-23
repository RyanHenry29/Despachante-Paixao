export const supabase = {
  from: (tableName: string) => ({
    select: (columns: string) => ({
      like: (column: string, value: string) => Promise.resolve({ data: [] }),
      or: (conditions: string) => Promise.resolve({ data: [] }),
      textSearch: (column: string, query: string, options: any) => Promise.resolve({ data: [] }),
      limit: (count: number) => Promise.resolve({ data: [] }),
    }),
  }),
};
