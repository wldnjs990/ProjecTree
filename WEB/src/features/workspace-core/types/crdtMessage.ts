export type AiMessageCategory = 'TECH' | 'CANDIDATE' | 'NODE';

export interface AiMessagePayload {
  nodeId: number;
  category: AiMessageCategory;
  content: string;
}

export interface SaveErrorPayload {
  action?: 'delete_node' | 'delete_candidate' | string;
  message?: string;
}

export type CrdtEnvelope =
  | {
      type: 'AI_MESSAGE';
      payload: AiMessagePayload;
    }
  | {
      type: 'SAVE_ERROR';
      payload: SaveErrorPayload;
    };
