/**
 * Extracts a human-readable error message from an ICP canister rejection.
 *
 * Canister trap messages look like:
 *   "Call was rejected: Reject code: 5, Reject text: Canister lvzw7-...-cai trapped explicitly: <REASON>"
 *
 * This utility strips the boilerplate and returns just the <REASON>, plus a
 * short error code for logging.
 */
export function extractICPError(err: unknown): {
  message: string;
  code: string;
} {
  const raw = err instanceof Error ? err.message : String(err);

  // Log full error to console for debugging
  console.error("[ICP Error]", raw);

  // Try to extract the trap reason
  const trapMatch = raw.match(/trapped explicitly:\s*(.+)$/);
  if (trapMatch) {
    const reason = trapMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Try to extract generic reject text
  const rejectMatch = raw.match(/Reject text:\s*(.+?)(?:,|$)/);
  if (rejectMatch) {
    const reason = rejectMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Not connected
  if (raw.toLowerCase().includes("not connected")) {
    console.error("[ICP Error Code: E001] Backend not ready");
    return {
      message: "Backend not ready. Please wait a moment and try again.",
      code: "E001",
    };
  }

  // Fallback
  const code = "E000";
  console.error(`[ICP Error Code: ${code}] ${raw}`);
  return { message: "An unexpected error occurred. Please try again.", code };
}

function toErrorCode(reason: string): string {
  const r = reason.toLowerCase();
  if (r.includes("already exists")) return "E002";
  if (r.includes("does not exist") || r.includes("not found")) return "E003";
  if (r.includes("name is required")) return "E010";
  if (r.includes("phone")) return "E011";
  if (r.includes("registration number")) return "E012";
  if (r.includes("pin") || r.includes("pincode")) return "E013";
  if (r.includes("validation") || r.includes("invalid")) return "E014";
  if (r.includes("unauthorized")) return "E403";
  if (r.includes("lock") || r.includes("busy")) return "E423";
  return "E099";
}
