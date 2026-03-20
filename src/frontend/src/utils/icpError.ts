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
  // Capture both message and stringified form to maximize pattern coverage
  let raw = "";
  if (err instanceof Error) {
    raw = err.message;
    // Sometimes the real cause is nested
    if ((err as Error & { cause?: unknown }).cause) {
      const cause = (err as Error & { cause?: unknown }).cause;
      raw += `\n${cause instanceof Error ? cause.message : String(cause)}`;
    }
  } else {
    raw = String(err);
  }

  // Also check toString in case message is empty
  if (!raw && err) {
    raw = String(err);
  }

  // Log full error to console for debugging
  console.error("[ICP Error Raw]", raw, err);

  // ---- ICP canister trap patterns ----

  // Format 1: "trapped explicitly: <REASON>"
  // Format 2: "IC0503: Canister xxx trapped explicitly: <REASON>"
  const trapPatterns = [
    /trapped explicitly[:\s]+([^\n]+)/i,
    /trapped explicitly[:\s]+([\s\S]+?)(?:\n\n|\r\n\r\n|$)/i,
    /Canister[^\n]+trapped[^:]*:[\s]*([^\n]+)/i,
  ];
  for (const pat of trapPatterns) {
    const m = raw.match(pat);
    if (m) {
      const reason = m[1]
        .trim()
        .replace(/\\n.*$/s, "")
        .trim();
      if (reason) {
        const code = toErrorCode(reason);
        console.error(`[ICP Error Code: ${code}] ${reason}`);
        return { message: reason, code };
      }
    }
  }

  // Format 3: description field in JSON body
  // e.g. "description": "IC0503: Canister ... trapped explicitly: message"
  const descMatch = raw.match(/"description"\s*:\s*"([^"]+)"/);
  if (descMatch) {
    const full = descMatch[1];
    const innerTrap = full.match(/trapped explicitly[:\s]+(.+)/);
    if (innerTrap) {
      const reason = innerTrap[1].trim();
      const code = toErrorCode(reason);
      console.error(`[ICP Error Code: ${code}] ${reason}`);
      return { message: reason, code };
    }
    const code = toErrorCode(full);
    console.error(`[ICP Error Code: ${code}] ${full}`);
    return { message: full, code };
  }

  // Format 4: Reject text
  const rejectMatch = raw.match(/[Rr]eject[\s_]text[:\s]+(.+?)(?:,|\n|$)/);
  if (rejectMatch) {
    const reason = rejectMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Format 5: Quoted message field
  const quotedMatch = raw.match(/message[:\s]+['"]([^'"]+)['"]/i);
  if (quotedMatch) {
    const reason = quotedMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Format 6: Error code at start like "IC0503: ..."
  const icCodeMatch = raw.match(/IC\d+:\s*(.+)/);
  if (icCodeMatch) {
    const reason = icCodeMatch[1].trim();
    const code = toErrorCode(reason);
    console.error(`[ICP Error Code: ${code}] ${reason}`);
    return { message: reason, code };
  }

  // Not connected / actor not ready
  if (
    raw.toLowerCase().includes("not connected") ||
    (raw.toLowerCase().includes("actor") &&
      !raw.toLowerCase().includes("canister")) ||
    raw.toLowerCase().includes("canister_id")
  ) {
    console.error("[ICP Error Code: E001] Backend not ready");
    return {
      message: "Backend not ready. Please wait a moment and try again. [E001]",
      code: "E001",
    };
  }

  // Network/fetch errors
  if (
    raw.toLowerCase().includes("failed to fetch") ||
    raw.toLowerCase().includes("networkerror") ||
    raw.toLowerCase().includes("network error")
  ) {
    console.error("[ICP Error Code: E005] Network error");
    return {
      message:
        "Network error. Please check your internet connection and try again. [E005]",
      code: "E005",
    };
  }

  // BigInt conversion errors (e.g. invalid pincode)
  if (
    raw.toLowerCase().includes("bigint") ||
    raw.toLowerCase().includes("cannot convert")
  ) {
    console.error("[ICP Error Code: E013] Invalid number format");
    return {
      message:
        "Invalid number in form (Pincode must be exactly 6 digits). Please check your entries. [E013]",
      code: "E013",
    };
  }

  // Fallback E099: show raw error so we can see what happened
  const code = "E099";
  const displayMessage = raw.length > 300 ? `${raw.substring(0, 300)}...` : raw;
  console.error(`[ICP Error Code: ${code}] ${raw}`);
  return {
    message: `Registration error. Please try again. If the problem persists, open browser console (F12) and note the full error. Raw: ${displayMessage}`,
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
