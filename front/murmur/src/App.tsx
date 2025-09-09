import { useState, useRef } from 'react';
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading, TextField, Button } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { HomePage } from "./components/HomePage";
import { CircleDetailPage } from "./components/CircleDetailPage";
import DomeGallery from "./components/DomeGallery";
import { Circle } from "./types";
import { api } from "./services/api";

type Page = 'home' | 'circle' | 'gallery' | 'search';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Circle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleCircleSelect = (circle: Circle) => {
    setSelectedCircle(circle);
    setCurrentPage('circle');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCircle(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentPage('home');
      return;
    }

    try {
      setIsSearching(true);
      const response = await api.circle.searchCircles({ query: searchQuery });
      if (response.success && response.data) {
        setSearchResults(response.data);
        setCurrentPage('search');
      } else {
        setSearchResults([]);
        setCurrentPage('home');
      }
    } catch (err) {
      setSearchResults([]);
      setCurrentPage('home');
    } finally {
      setIsSearching(false);
    }
  };



  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        align="center"
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

        <Box ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
          <Flex gap="2" align="center">
            <TextField.Root
              placeholder="搜你想搜..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              style={{ flex: 1 }}
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              size="2"
            >
              <MagnifyingGlassIcon />
            </Button>
          </Flex>

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
        {currentPage === 'search' && (
          <Box style={{ height: '100vh', padding: '2rem' }}>
            <Box mb="4">
              <Heading size="6" mb="2">
                搜索结果: "{searchQuery}"
              </Heading>
              <Box style={{ color: 'var(--gray-11)' }}>
                找到 {searchResults.length} 个相关圈子
              </Box>
            </Box>
            {searchResults.length === 0 ? (
              <Box style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                color: 'var(--gray-11)'
              }}>
                <Heading size="4" mb="2">没有找到相关圈子</Heading>
                <Box>尝试使用其他关键词搜索</Box>
              </Box>
            ) : (
              <Box style={{ height: 'calc(100vh - 200px)' }}>
                <DomeGallery 
                  circles={searchResults}
                  onCircleSelect={handleCircleSelect}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default App;
