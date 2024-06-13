/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    headers() {
        return [
            {
                source: "/images/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, stale-while-revalidate",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
