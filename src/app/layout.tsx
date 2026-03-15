import { DevTools } from "@/components/providers/dev-tools";
import { MSWProvider } from "@/components/providers/msw-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { OverlayProvider } from "@/components/providers/overlay-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 수강신청 서비스",
    default: "수강신청 서비스",
  },
  description: "배움에 투자하는 가장 스마트한 방법. 강의를 탐색하고 수강 신청하세요.",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="bg-[#08090E]">
      <body
        className={`${playfairDisplay.variable} ${notoSansKR.variable} bg-[#08090E] text-[#EAE5DC]`}
      >
        <SessionProvider>
          <MSWProvider>
            <QueryProvider>
              <OverlayProvider>
                <MotionProvider>
                  {/* Mobile-first container: full width on mobile, centered on desktop */}
                  <div className="relative mx-auto min-h-screen max-w-[430px] overflow-x-hidden">
                    {children}
                  </div>
                  <Toaster
                    theme="dark"
                    position="top-center"
                    toastOptions={{
                      style: {
                        background: "#121620",
                        border: "1px solid rgba(234,229,220,0.12)",
                        color: "#EAE5DC",
                      },
                    }}
                  />
                  <DevTools />
                </MotionProvider>
              </OverlayProvider>
            </QueryProvider>
          </MSWProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
