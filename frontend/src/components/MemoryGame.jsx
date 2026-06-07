import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// The list of 8 emojis we will use to create pairs.
const EMOJIS = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥑', '🍍'];

export function MemoryGame() {
  // STATE DEFINITIONS
  // "cards" stores our 16 playing cards
  const [cards, setCards] = useState([]);
  
  // "flippedIndices" tracks the 0, 1, or 2 cards currently turned over
  const [flippedIndices, setFlippedIndices] = useState([]);
  
  // "moves" keeps track of the player's attempts
  const [moves, setMoves] = useState(0);
  
  // "matches" keeps track of how many pairs the player has successfully found
  const [matches, setMatches] = useState(0);
  
  // "isLocked" prevents the user from clicking while cards are animating back over
  const [isLocked, setIsLocked] = useState(false);

  // Initialize the game when the component first loads onto the screen
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // 1. Duplicate our 8 emojis so we have exactly 8 pairs (16 total)
    const pairedEmojis = [...EMOJIS, ...EMOJIS];
    
    // 2. Shuffle them randomly using a simple JavaScript math trick
    const shuffledEmojis = pairedEmojis.sort(() => Math.random() - 0.5);
    
    // 3. Map them into detailed card objects so we can track their state
    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      isFlipped: false,
      isMatched: false
    }));
    
    // Reset all state for a fresh game
    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
  };

  const handleCardClick = (index) => {
    // RULE 1: If the board is locked for animation, or if the card is already face-up, STOP.
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    // RULE 2: Flip the clicked card to face-up
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    // Track this new card in our flipped array
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // RULE 3: If we have flipped exactly two cards, check for a match
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1); // Tell React they made a move
      setIsLocked(true);   // LOCk the board out from clicking!

      const firstIndex = newFlippedIndices[0];
      const secondIndex = newFlippedIndices[1];

      // Do they match?
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        // YES! Mark them permanently as matched.
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setMatches(matches + 1); // Record the successful match!
        setFlippedIndices([]); // Clear tracking so they can pick again
        setIsLocked(false);    // Unlock the board for the next turn
      } else {
        // NO! Wait 1 second (1000ms), then flip them back face-down.
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]); 
          setIsLocked(false);  // Unlock the board after animation finishes
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-lg mx-auto transition-colors">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
        Memory Match
      </h2>
      
      {/* Dynamic Scoreboards */}
      <div className="flex gap-8 mb-6 text-slate-500 dark:text-slate-400">
        <p>Moves: <span className="font-bold text-blue-500">{moves}</span></p>
        <p>Matches: <span className="font-bold text-green-500">{matches}</span> / 8</p>
      </div>

      {/* Victory Message when game is complete */}
      {matches === 8 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6"
        >
          You Won in {moves} moves! 🎉
        </motion.div>
      )}

      {/* The 4x4 Grid Board */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {cards.map((card, index) => {
          // A card is visible if it is currently flipped OR if it was already matched
          const isVisible = card.isFlipped || card.isMatched;

          return (
            <motion.div 
              key={card.id} 
              className="relative h-20 w-20 cursor-pointer"
              onClick={() => handleCardClick(index)}
              style={{ perspective: 1000 }} // Gives the 3D rotation depth!
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-full h-full relative shadow-md rounded-xl"
                animate={{ rotateY: isVisible ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side (Face-down card) */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="opacity-80">❓</span>
                </div>

                {/* Back Side (Revealed Emoji) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-3xl md:text-4xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow-inner ${card.isMatched ? 'opacity-50' : 'opacity-100'}`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {card.emoji}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={initializeGame}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-colors focus:outline-none"
      >
        Restart Game
      </motion.button>
    </div>
  );
}
