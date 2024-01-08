import jwt from "jsonwebtoken";

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAnhtUcE6TW900WphnQdR4kjFzOBijskFTqRStB+qiSmT2Z9wj
oMvV/zx9gmehl3X6ykkb8/VbMNTY3JvxEnaVuCHFl51hG4GvUFsDM8U2KaPZd3hT
KdIKhSe3/deyzOsKeC0fsUdfyHtvcMCoc2dj2Yg8pJc9vNakVFH5k9Wdx97a1mw8
Rhj2/6q20eejh2wbM2cKwV3kvpsJMY1hToxSezGnIUeZ0L1aswEadNMygqFuTJwP
1Jx5hIboR9XpSF/jgo9NeWGWkeHZnBK3A3u14YRYSxYL34/v9kUFhG1CW1ulv7J2
Qeh09bfuTN+kKmXiWC3zvZmtBfry4RUdKPTG4QIDAQABAoIBAC/bO+LGlen/ecJW
USLm6hvuJd777kidZ3JNVNaJmdgE2WS0iIA6UqrwJ1laftn2lxO1r2VXheOw+XdF
KGIbTNQwPLvYojUOOv+KnNyFvBA8jS2RWTLWZeLKE/Ic4P0Pw9p+ZhJl9UMcwa2S
UyqjR+DnUNvM/53yJklziqTJyvldK/ZSNhIl5A031v6oLEI3MlvxZ7w3Zf16eseX
hPRG1JC0y4/C9SMhf8uamIKJzPeRScY0U0cW2uhGjUQ0OwRDMRa5xYbjKmTaS8Lk
o5+dv0jYbrfpOkfv/Lm5OrEYdW68W6USYqsZmuxkM8zzrZP81lCEWsLZCo2DSlWU
0ue/UsUCgYEA3KO9QSvbBRd2gTmmvWpuZJH5FAw9SzeK0C++dc5Wu1bMMpdPeqjp
hTZWc0sW4IyEi04aW2jsKSvpqMbwMqrP0IEr3tABmDTr9hgBRqNTCqKPVp7/ATBH
E3Vx6lYKwVBSpGjJ2Vsy92caDNeTuhAH7HA7JYWA7WJ721RBdCRTw1MCgYEAt3II
ZVIExb5+7XYXYk7CrX3uMZX49xrIajn7DG/9hPpINWmb95ZQOlbwkl79xMlx2ZfE
axaNMuuwSgLvtkYJhTRTspYCHiKr/FsdZTjlgvyuAgQn14AqEu2XDZMvZ9mFTZCY
KlXvZUuf06+2TEObS4OxQa3b5UAGfr3Wr8kymnsCgYBrsTAKw1Ef5xfccztDcNN5
GxasBl1UfUOv4d3gulnzDqaUeu48PH3em2sO0zPTXkLDi9epjkjWv6xIyPEsidrt
Nl8nXfepRwt1Drpws/8wTbAQ44IsHlhS0xxK+Lw/JulvfgYnpS/3OcepRP/B7Vkw
uobkBYmsVEmIAFQCUEjiKQKBgHiG6LNBTzdpMNXt9/E0VD5O9hgINDqOk00P6T1D
u2sKUjUdvUbPsMiT5J4W4V7RCAdx6rB9caoaJoqKIVs96vVk6vT0EFIib6NvbgHa
fxkv0VgryM2TPJGRHuThZo0x4p6SuRdfvNlt9YXM9dZnuPnFfcnsZATcqyfMrOh0
JdZPAoGBAK6e9HXB7uyPLlqt+v+XhbQtao5xFuKLn4prfwG5XiDz32HlvSHLUwCF
WzxxHZ6QOxynZT3OAhdd4fQTP44T0+G8nffvJ1WQupb3y6yWu/cm4g1aqHC72I/5
qltqaYYBnP+vYabEvAd7sQVsarhP78ghVT6ZL21S15aV1hE4TmK8
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnhtUcE6TW900WphnQdR4
kjFzOBijskFTqRStB+qiSmT2Z9wjoMvV/zx9gmehl3X6ykkb8/VbMNTY3JvxEnaV
uCHFl51hG4GvUFsDM8U2KaPZd3hTKdIKhSe3/deyzOsKeC0fsUdfyHtvcMCoc2dj
2Yg8pJc9vNakVFH5k9Wdx97a1mw8Rhj2/6q20eejh2wbM2cKwV3kvpsJMY1hToxS
ezGnIUeZ0L1aswEadNMygqFuTJwP1Jx5hIboR9XpSF/jgo9NeWGWkeHZnBK3A3u1
4YRYSxYL34/v9kUFhG1CW1ulv7J2Qeh09bfuTN+kKmXiWC3zvZmtBfry4RUdKPTG
4QIDAQAB
-----END PUBLIC KEY-----`;

// sign jwt
export function signJWT(payload, expiresIn) {
  return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
}

// verify jwt
export function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
}
