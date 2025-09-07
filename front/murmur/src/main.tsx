import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import PixelBlast from "./components/PixelBlast";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: -1 
        }}>
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="#B19EEF"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0.3}
            enableRipples
            rippleSpeed={0.3}
            rippleThickness={0.1}
            rippleIntensityScale={1}
            liquid={false}
            speed={0.4}
            edgeFade={0.2}
            transparent
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
              <WalletProvider autoConnect>
                <App />
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </div>
      </div>
    </Theme>
  </React.StrictMode>,
);
