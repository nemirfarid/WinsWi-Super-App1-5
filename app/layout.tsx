import './globals.css';
import type {ReactNode} from 'react';
import PwaRegister from '@/components/pwa-register';
import WinsWiShell from '@/components/winswi-shell';
export const metadata={title:'WinsWi — The Global Super App',description:'WinsWi, the adaptive global intelligent Super-App.',applicationName:'WinsWi'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="fr"><body><PwaRegister/><WinsWiShell>{children}</WinsWiShell></body></html>}
