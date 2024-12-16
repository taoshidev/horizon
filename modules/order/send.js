import config from "config";

const signalServer = config.get("signal-server");

export async function send(signal) {
  const data = { ...signal, api_key: "xxxx" };

  try {
    const response = await fetch(`${signalServer}/api/receive-signal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      data,
      status: response.status,
      message: result.message || "Send to PTN",
      error: !response.ok ? result.error || "Failed to send to PTN" : undefined,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to send to PTN",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
