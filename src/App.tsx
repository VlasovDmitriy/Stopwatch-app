import React, { useState } from "react";
import Stopwatch from "./Stopwatch";
import { FaPlus} from "react-icons/fa";
import "./buttons.css"; 
import { motion, AnimatePresence } from "framer-motion";



type StopwatchItem = {
  id: string; 
};

function App() {
  const [stopwatches, setStopwatches] = useState<StopwatchItem[]>([]);

  const createNewStopwatch = () => {
    
    const newStopwatch: StopwatchItem = {
      id: crypto.randomUUID(), 
    };
    setStopwatches([...stopwatches, newStopwatch]);
  };

  const removeStopwatch = (id: string) => {
    setStopwatches(stopwatches.filter((sw) => sw.id !== id));
  };

  return (
    <div className="app">
      <button onClick={createNewStopwatch} className="create-button">
      <FaPlus /> Create New Stopwatch
      </button>
      <div className="stopwatches-container">
      <AnimatePresence>
          {stopwatches.map((sw) => (
            <motion.div
              key={sw.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="stopwatch-wrapper"
            >
              {/* <button
                onClick={() => removeStopwatch(sw.id)}
                className="remove-button"
              >
                <FaTrash /> Remove
              </button> */}
              <Stopwatch onRemove={() => removeStopwatch(sw.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;