import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Box, Group, Flex, Button, Container, Title, Text } from '@mantine/core';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="flex-col w-screen h-screen bg-blue-100">
      <div className="flex justify-between items-center p-4">
        <Title 
          order={1} 
          className="py-4 text-3xl font-extrabold"
        >
            Diabetes Tracker
        </Title>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer' }}
            className="bg-white rounded-xl p-2 hover:bg-blue-400 hover:text-white"
          >
            Home
          </Button>
          <div className="flex items-center bg-white rounded-xl p-2 hover:bg-blue-400 hover:text-white">
            <Text c="dimmed" className="mr-4">
                User ID: <Text span fw={500}>{userId}</Text>
            </Text>
            <Button 
                variant="filled" 
                onClick={handleLogout}
            >
                Logout
            </Button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center p-6">
        <Card 
          shadow="sm" 
          padding="xl" 
          radius="md" 
          withBorder 
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default Layout;
