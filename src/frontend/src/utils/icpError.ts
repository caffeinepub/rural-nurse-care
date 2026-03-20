/**
 * Extracts a human-readable error message from an ICP canister rejection.
 *
 * Handles multiple SDK error formats:
 *   - "Canister ... trapped explicitly: <REASON>"
 *   - "Reject text: <REASON>"
 *   - "message: '<REASON>'" or "message: \"<REASON>\""
 *   - "AgentError: ..."
 *   - Raw JavaScript errors (TypeError, SyntaxError, etc.)
 */
export function extractICPError(err: unknown): {
  message: string;
  code: string;
} {
  const raw = err instanceof Error ? err.message : String(err);

  // Log full error to console for debugging
  console.error("[ICP Error Raw]", raw);

  // Try to extract the trap reason (handle multiline with 's' flag equivalent)
  const trapMatch = raw.match(
    /trapped explicitly[:\s]+([\s\S]+?)(?:\s*$|\n\n)/,
  );
  if (trapMatch) {
    const reason = trapMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Alternative trap format
  const trapMatch2 = raw.match(/trapped[^:]*:\s*(.+)/);
  if (trapMatch2) {
    const reason = trapMatch2[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Try to extract generic reject text
  const rejectMatch = raw.match(/[Rr]eject[\s_]text[:\s]+(.+?)(?:,|$)/m);
  if (rejectMatch) {
    const reason = rejectMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Try quoted message format (single or double quotes)
  const quotedMatch = raw.match(/message[:\s]+['"]([^'"]+)['"]/i);
  if (quotedMatch) {
    const reason = quotedMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Not connected / actor not ready
  if (
    raw.toLowerCase().includes("not connected") ||
    raw.toLowerCase().includes("actor") ||
    raw.toLowerCase().includes("canister_id")
  ) {
    console.error("[ICP Error Code: E001] Backend not ready");
    return {
      message: "Backend not ready. Please wait a moment and try again.",
      code: "E001",
    };
  }

  // Network/fetch errors
  if (
    raw.toLowerCase().includes("fetch") ||
    raw.toLowerCase().includes("network") ||
    raw.toLowerCase().includes("failed to fetch")
  ) {
    console.error("[ICP Error Code: E005] Network error");
    return {
      message:
        "Network error. Please check your internet connection and try again.",
      code: "E005",
    };
  }

  // BigInt conversion errors (e.g. invalid pincode)
  if (
    raw.toLowerCase().includes("bigint") ||
    raw.toLowerCase().includes("convert")
  ) {
    console.error("[ICP Error Code: E013] Invalid number format");
    return {
      message:
        "Invalid number in form (e.g. Pincode must be exactly 6 digits). Please check your entries.",
      code: "E013",
    };
  }

  // Fallback: show the actual raw error so user can see what happened
  const code = "E000";
  const displayMessage = raw.length > 200 ? `${raw.substring(0, 200)}...` : raw;
  console.error(`[ICP Error Code: ${code}] ${raw}`);
  return {
    message: `Unexpected error: ${displayMessage}`,
    code,
  };
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
