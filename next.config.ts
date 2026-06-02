import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

function getLocalIPv4Hosts() {
  return Object.values(networkInterfaces()).flatMap((addresses) =>
    (addresses ?? [])
      .filter((address) => address.family === "IPv4")
      .map((address) => address.address)
  );
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Allow dev-only Next.js assets and HMR from every local access path.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ...getLocalIPv4Hosts(),
  ],
};

export default nextConfig;
