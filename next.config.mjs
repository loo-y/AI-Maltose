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
                        value: "max-age=31536000",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
