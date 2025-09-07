import { useState } from 'react';
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { HomePage } from "./components/HomePage";
import { CircleDetailPage } from "./components/CircleDetailPage";
import { Circle } from "./types";

type Page = 'home' | 'circle' | 'gallery';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  const handleCircleSelect = (circle: Circle) => {
    setSelectedCircle(circle);
    setCurrentPage('circle');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCircle(null);
  };

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          backgroundColor: "var(--color-background)",
          zIndex: 10
        }}
      >
        <Box>
          <Heading 
            size="5" 
            style={{ cursor: 'pointer' }}
            onClick={() => setCurrentPage('home')}
          >
            吐槽圈
          </Heading>
        </Box>


        <Box>
          <ConnectButton />
        </Box>
      </Flex>

      <Box style={{ minHeight: 'calc(100vh - 60px)' }}>
        {currentPage === 'home' && (
          <HomePage onCircleSelect={handleCircleSelect} />
        )}
        {currentPage === 'circle' && selectedCircle && (
          <CircleDetailPage 
            circle={selectedCircle} 
            onBack={handleBackToHome} 
          />
        )}
      </Box>
    </>
  );
}

export default App;
