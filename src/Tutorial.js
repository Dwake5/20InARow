import { Text, Box } from "@chakra-ui/react";

export const Tutorial = () => {
  return (
    <Box textAlign='center'>
      <Text>Roll a random number from 1 to 1000</Text>
      <Text>Place it in one of the empty spots</Text>
      <Text>If they are all in order, you win!</Text>
    </Box>
  );
};
