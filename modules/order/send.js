export async function send(signal, config) {
  const data = { ...signal, api_key: config.ptn_api_key};

  try {
    const response = await fetch(
      `${config["signal-server"]}/api/receive-signal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

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
