export type ApiResponse = {
     status: "success" | "error";
     data: any | null;
     error: {
          code: number;
          message: string;
     } | null;
};
