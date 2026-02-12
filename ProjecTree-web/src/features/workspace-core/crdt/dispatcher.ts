import { processCrdtMessage } from '../services/crdtMessageService';

export function dispatchCrdtMessage(message: unknown): void {
  processCrdtMessage(message);
}
