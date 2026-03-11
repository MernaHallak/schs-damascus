/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  // مسارات عربية للزوار (أفضل للـ SEO + تجربة عربية موحّدة)
  // - نعرض للزائر الروابط العربية
  // - ونخلي الملفات داخل app بالإنجليزي (services, articles, contact, tests)
  async rewrites() {
    return [
      { source: "/الخدمات", destination: "/services" },
      { source: "/الخدمات/:path*", destination: "/services/:path*" },

      { source: "/الفحوصات", destination: "/tests" },
      { source: "/الفحوصات/:path*", destination: "/tests/:path*" },
        

      { source: "/اتصل-بنا", destination: "/contact" },
      { source: "/اتصل-بنا/:path*", destination: "/contact/:path*" },

      { source: "/المقالات", destination: "/articles" },
      { source: "/المقالات/:path*", destination: "/articles/:path*" },
    ];
  },

  async redirects() {
    return [
      // نسخ إنجليزية → نحولها دائمًا للنسخ العربية (Canonical موحد)
      { source: "/services", destination: "/الخدمات", permanent: true },
      { source: "/services/:path*", destination: "/الخدمات/:path*", permanent: true },

      { source: "/tests", destination: "/الفحوصات", permanent: true },
      { source: "/tests/:path*", destination: "/الفحوصات/:path*", permanent: true },

      { source: "/contact", destination: "/اتصل-بنا", permanent: true },
      { source: "/contact/:path*", destination: "/اتصل-بنا/:path*", permanent: true },

      { source: "/articles", destination: "/المقالات", permanent: true },
      { source: "/articles/:path*", destination: "/المقالات/:path*", permanent: true },
    ];
  },
};

module.exports = nextConfig;
