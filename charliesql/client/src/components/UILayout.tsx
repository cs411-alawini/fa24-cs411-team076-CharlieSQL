import React from 'react';
import { Paper, Container, Title, Stack } from '@mantine/core';

interface UILayoutProps {
  children: React.ReactNode;
  title?: string;
}

const UILayout: React.FC<UILayoutProps> = ({ children, title }) => {
  return (
    <Container size="sm" py="xl">
      <div className="bg-blue-200 text-indigo-900 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
        <Stack>
          {title && (
            <Title order={2} className="py-4 text-2xl font-bold sticky top-0 bg-blue-200 z-10">
              {title}
            </Title>
          )}
          <div className="space-y-6 text-indigo-900">
            {children}
          </div>
        </Stack>
      </div>
    </Container>
  );
};

export default UILayout; 