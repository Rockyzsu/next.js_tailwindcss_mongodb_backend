import './globals.css';

export const metadata = {
  title: '短剧下载管理',
  description: '短剧下载状态管理后台',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
