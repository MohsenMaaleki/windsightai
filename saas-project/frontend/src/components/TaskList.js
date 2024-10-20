import React from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';

const TaskList = ({ tasks }) => {
  return (
    <Box mt={5}>
      <Heading size="md" mb={3}>Your Tasks</Heading>
      <VStack spacing={3} align="stretch">
        {tasks.map((task) => (
          <Box key={task.id} p={3} shadow="md" borderWidth="1px">
            <Heading size="sm">{task.title}</Heading>
            <Text mt={1}>{task.description}</Text>
            <Text mt={1}>Status: {task.completed ? 'Completed' : 'Pending'}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TaskList;