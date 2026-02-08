import { springInternalClient } from "../springInternalClient";

interface DeleteCandidatePayload {
  candidateId: number;
}

export async function deleteCandidateToSpring(
  payload: DeleteCandidatePayload,
): Promise<boolean> {
  try {
    const result = await springInternalClient.delete(
      `/api/internal/nodes/candidates/${payload.candidateId}`,
    );

    console.log(
      "[Delete Candidate] Spring response: ",
      result.data.success,
    );
    return true;
  } catch (error: any) {
    console.error(
      "Spring candidate delete failed",
      {
        candidateId: payload.candidateId,
        message: error?.message,
        response: error?.response?.data,
      },
      new Date().toISOString(),
    );
    return false;
  }
}
