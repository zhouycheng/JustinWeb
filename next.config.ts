import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 允许通过局域网 IP 访问开发服务器
  allowedDevOrigins: ["10.244.143.119"],
};

export default nextConfig;
