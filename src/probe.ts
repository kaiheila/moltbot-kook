export async function probeKookAccount(params: {
  token: string;
}): Promise<{ ok: boolean; user?: { id: string; username: string }; error?: string }> {
  const { token } = params;

  try {
    const response = await fetch("https://www.kookapp.cn/api/v3/user/me", {
      headers: { Authorization: `Bot ${token}` },
    });
    const data = await response.json();
    
    if (data.code === 0) {
      return {
        ok: true,
        user: {
          id: String(data.data.id ?? ""),
          username: data.data.username ?? "bot",
        },
      };
    }
    
    return {
      ok: false,
      error: data.message ?? "Unknown error",
    };
  } catch (err) {
    return {
      ok: false,
      error: String(err),
    };
  }
}
