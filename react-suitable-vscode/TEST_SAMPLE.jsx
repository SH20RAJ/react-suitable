// 🧪 TEST SAMPLE FILE - Use this to test the Suitable VS Code Extension
// This file contains common issues that Suitable can fix

import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

// Unused variables and imports above should be removed by Suitable

function TestComponent({ title, onSave }) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  
  // Unused variables
  const unusedVariable = "This should be removed";
  const anotherUnused = 42;
  
  // This function uses some of the imports
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <div>
        {data.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default TestComponent;

/* 
🧪 TESTING INSTRUCTIONS:

1. Open this file in VS Code (in Extension Development Host)
2. Press Ctrl+Shift+Alt+F (Mac: Cmd+Shift+Alt+F) to fix current file
3. Expected results:
   - Unused imports removed (axios, _, moment, useEffect, useCallback)
   - Unused variables removed (unusedVariable, anotherUnused)  
   - Only used imports remain (React, useState)
   - Unused onSave prop parameter should be handled

4. Try other commands:
   - Ctrl+Shift+P > "Suitable: Dry Run" (preview changes)
   - Right-click file > "Fix Current File"
   - Ctrl+Shift+P > "Suitable: Fix Workspace"

5. Check Output Panel:
   - View > Output > Select "Suitable" from dropdown
   - Should show detailed logs of the operation
*/