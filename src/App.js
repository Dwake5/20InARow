import {
  Button,
  ChakraProvider,
  Heading,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import "./App.css";
import { Tutorial } from "./Tutorial";
import { useState } from "react";
import { useStickyState } from "./useStickyState";

const totalSlots = 20;
const maxRandom = 1000;

const generateRandomNumber = () => {
  return Math.ceil(Math.random() * maxRandom);
};

const GetComponent = ({isInOrder, currNumber, startGame}) => {
  if (!isInOrder) {
    return <Text fontWeight='500'>Numbers are not in order, please try again</Text>;
  }

  if (currNumber) {
    return <Heading>{currNumber}</Heading>;
  }

  return (
    <Button onClick={startGame} mt={2}>
      Roll Number
    </Button>
  );
};

const isArrayInOrder = (arr) => {
  const filteredArr = [...arr].filter(Boolean);
  const sortedArr = [...filteredArr].sort((a, b) => a - b);
  return JSON.stringify(filteredArr) === JSON.stringify(sortedArr);
};

function App() {
  const [currNumber, setCurrNumber] = useState(null);
  const [slots, setSlots] = useState(Array.from(20).fill(null));
  const [attempts, setAttempts] = useStickyState(0, "attempts");
  const [highScore, setHighScore] = useStickyState(0, "highScore");
  const [currScore, setCurrScore] = useState(0);

  const getNumber = () => {
    let newNumber = generateRandomNumber();
    const currButtonNumbers = [...new Set(slots)];
    while (currButtonNumbers.includes(newNumber)) {
      newNumber = generateRandomNumber();
    }
    setCurrNumber(newNumber);
  };

  const handleButtonClick = (buttonIndex) => {
    const newButtonNumbers = [...slots];
    newButtonNumbers[buttonIndex] = currNumber;
    setSlots(newButtonNumbers);
    setCurrNumber(null);
    getNumber();

    const score = newButtonNumbers.filter(Boolean).length;
    const isInOrder = isArrayInOrder(newButtonNumbers);
    const finalScore = isInOrder ? score : score - 1;
    setCurrScore(finalScore);

    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
  };

  const restart = () => {
    setCurrNumber(null);
    setSlots(Array.from(20).fill(null));
    setCurrScore(0);
  };

  const startGame = () => {
    getNumber();
    setAttempts((tries) => tries + 1);
  };

  const isInOrder = isArrayInOrder(slots);

  return (
    <ChakraProvider>
      <Flex alignItems="center" direction="column" w="100%" mb={4} pb={4}>
        <Heading>20 In A Row</Heading>

        <Tutorial />

        <Flex mt={2} alignItems="baseline">
          <Text pr={4} fontSize="12px">
            Attempts: {attempts}
          </Text>
          <Text pr={4} fontSize="12px">
            High Score: {highScore}
          </Text>
          <Button size="xs" bg="coral" onClick={restart}>
            Restart?
          </Button>
        </Flex>

        <Text mt={2}>Current Score: {currScore}</Text>

        <Box minH="50px" mt={4}>
          <GetComponent
            isInOrder={isInOrder}
            currNumber={currNumber}
            startGame={startGame}
          />
        </Box>

        <Flex direction="column" mt={4} alignItems="center">
          {Array.from({ length: totalSlots }, (_, i) => {
            const buttonNumber = slots[i];
            return (
              <Button
                isDisabled={buttonNumber || !isInOrder || !currNumber}
                onClick={() => handleButtonClick(i)}
                key={i}
                px={4}
                py={2}
                my={1}
                size="xs"
                w="60px"
              >
                <Text fontSize="10px" pr={2}>
                  {i + 1}:
                </Text>
                <Text fontSize="14px">{buttonNumber || "____"}</Text>
              </Button>
            );
          })}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
