declare module "pdf-parse" {
  export interface PDFParseResult {
    text: string;
    info?: Record<string, unknown>;
  }

  function pdf(
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: unknown
  ): Promise<PDFParseResult>;

  export default pdf;
}
