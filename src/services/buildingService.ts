import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  BuildingNodeResponseDto,
  BuildingNodeRequest,
  NodeTypeResponseDto,
  NodeTypeRequest,
} from "@/types/models";

export const buildingService = {
  // ================= BUILDING NODES =================
  /**
   * List all building nodes (flat list)
   */
  async listNodes(): Promise<BuildingNodeResponseDto[]> {
    const { data } = await api.get<ApiResponse<BuildingNodeResponseDto[]>>(
      "/api/building-nodes"
    );
    return data.result;
  },

  /**
   * Get single building node by ID (without children)
   */
  async getNodeById(id: string): Promise<BuildingNodeResponseDto> {
    const { data } = await api.get<ApiResponse<BuildingNodeResponseDto>>(
      `/api/building-nodes/${id}`
    );
    return data.result;
  },

  /**
   * Get recursive tree of building nodes starting from a specific node level (e.g. 0 or 1)
   */
  async getNodeTreeByLevel(nodeLevel: number = 0): Promise<BuildingNodeResponseDto[]> {
    const { data } = await api.get<ApiResponse<BuildingNodeResponseDto[]>>(
      `/api/building-nodes/tree/${nodeLevel}`
    );
    return data.result;
  },

  /**
   * Create new building node
   */
  async createNode(payload: BuildingNodeRequest): Promise<BuildingNodeResponseDto> {
    const { data } = await api.post<ApiResponse<BuildingNodeResponseDto>>(
      "/api/building-nodes",
      payload
    );
    return data.result;
  },

  /**
   * Update building node
   */
  async updateNode(
    id: string,
    payload: BuildingNodeRequest
  ): Promise<BuildingNodeResponseDto> {
    const { data } = await api.put<ApiResponse<BuildingNodeResponseDto>>(
      `/api/building-nodes/${id}`,
      payload
    );
    return data.result;
  },

  /**
   * Delete building node
   */
  async deleteNode(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/building-nodes/${id}`);
  },

  // ================= NODE TYPES =================
  /**
   * List all node types (e.g. Building, Floor, Room)
   */
  async listNodeTypes(): Promise<NodeTypeResponseDto[]> {
    const { data } = await api.get<ApiResponse<NodeTypeResponseDto[]>>(
      "/api/node-types"
    );
    return data.result;
  },

  /**
   * Get node type by ID
   */
  async getNodeTypeById(id: string): Promise<NodeTypeResponseDto> {
    const { data } = await api.get<ApiResponse<NodeTypeResponseDto>>(
      `/api/node-types/${id}`
    );
    return data.result;
  },

  /**
   * Create new node type
   */
  async createNodeType(payload: NodeTypeRequest): Promise<NodeTypeResponseDto> {
    const { data } = await api.post<ApiResponse<NodeTypeResponseDto>>(
      "/api/node-types",
      payload
    );
    return data.result;
  },

  /**
   * Update node type
   */
  async updateNodeType(
    id: string,
    payload: NodeTypeRequest
  ): Promise<NodeTypeResponseDto> {
    const { data } = await api.put<ApiResponse<NodeTypeResponseDto>>(
      `/api/node-types/${id}`,
      payload
    );
    return data.result;
  },

  /**
   * Delete node type
   */
  async deleteNodeType(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/node-types/${id}`);
  },
};
