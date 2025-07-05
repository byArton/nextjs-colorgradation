// app/layout.tsx
import '@fortawesome/fontawesome-svg-core/styles.css'; // ←重要！
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata = {
  title: 'My Gradient App',
};

function Header() {
  return (
    <div
      className="flex justify-between items-center h-15 w-full bg-white shadow-sm pl-8 pr-8 fixed top-0 left-0 right-0 z-50
    sm:pr-6 sm:pl-6
    md:pr-10 md:pl-10
    lg:pr-20 lg:pl-20"
    >
      <div className="flex items-center jusi gap-2">
        <h1 className="text-base font-bold flex flex-row justify-center items-center">
          <FontAwesomeIcon icon={faPalette} className="text-[#333]" />{' '}
          <div className="ml-2 font-sans text-[#333]">Palette</div>
        </h1>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={noto.variable}>
      {/* headerを作成 */}

      <body className="font-sans mt-16">
        <Header />
        {children}
      </body>
    </html>
  );
}
