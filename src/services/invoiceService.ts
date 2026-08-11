import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  InvoiceResponseDto,
  InvoiceRequestDto,
} from "@/types/models";

export const invoiceService = {
  /**
   * Get invoice details by ID
   */
  async getById(id: string): Promise<InvoiceResponseDto> {
    const { data } = await api.get<ApiResponse<InvoiceResponseDto>>(
      `/api/invoices/${id}`
    );
    return data.result;
  },

  /**
   * Pay invoice
   */
  async payInvoice(id: string): Promise<InvoiceResponseDto> {
    const { data } = await api.post<ApiResponse<InvoiceResponseDto>>(
      `/api/invoices/${id}/pay`
    );
    return data.result;
  },

  /**
   * Student: Get my invoices
   */
  async getMyInvoices(): Promise<InvoiceResponseDto[]> {
    const { data } = await api.get<ApiResponse<InvoiceResponseDto[]>>(
      "/api/users/me/invoices"
    );
    return data.result;
  },

  /**
   * Admin: Create a new invoice
   */
  async createInvoice(payload: InvoiceRequestDto): Promise<InvoiceResponseDto> {
    const { data } = await api.post<ApiResponse<InvoiceResponseDto>>(
      "/api/invoices",
      payload
    );
    return data.result;
  },

  /**
   * Admin: List all invoices
   */
  async listAllInvoices(): Promise<InvoiceResponseDto[]> {
    const { data } = await api.get<ApiResponse<InvoiceResponseDto[]>>(
      "/api/invoices"
    );
    return data.result;
  },
};
