import nextConfig from "eslint-config-next/core-web-vitals";

export default [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "test-smoke/**",
      "runnable/**",
    ],
  },
];
