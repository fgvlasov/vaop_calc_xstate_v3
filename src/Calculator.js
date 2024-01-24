import React, { useState } from 'react';
import { createMachine, createActor } from 'xstate';
import { evaluate } from 'mathjs';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const vaopCalcMachine = createMachine(
    {
      id: 'calculator',
      initial: 'idle',
      context: {
        input: '',
      },
      states: {
        idle: {
          on: {
            DIGIT: { actions: 'updateInput' },
            OPERATOR: { actions: 'updateInput' },
            EQUALS: { target: 'result', actions: 'updateInput' },
            CLEAR: 'idle',
          },
        },
        result: {
          on: {
            DIGIT: { target: 'idle', actions: 'updateInput' },
            OPERATOR: { actions: 'updateInput' },
            EQUALS: { actions: 'updateInput' },
            CLEAR: 'idle',
          },
        },
      },
    },
    {
      actions: {
        updateInput: (context, event) => {
          if (event && event.value !== undefined) {
            context.input += event.value;
          } else {
            console.error('Event or event.value is undefined:', event);
          }
        },
      },
    }
  );

  const vaopCalcActor = createActor(vaopCalcMachine);

  // Attach a listener to the actor
// Attach a listener to the actor
  vaopCalcActor.subscribe((state) => {
	console.log('Actor State:', state);
	if (state.changed && state.value === 'result') {
	  try {
		setResult(state.context.input); // Set result directly from the context input
	  } catch (error) {
		console.error('Error during evaluation:', error);
		setResult('Error');
	  }
	  setInput('');
	}
  });
  

  const handleButtonClick = (value) => {
	if (value === '=') {
	  try {
		vaopCalcActor.send({ type: 'EQUALS' }); // Send EQUALS event to trigger the state machine transition
	  } catch (error) {
		console.error('Error during evaluation:', error);
		setResult('Error');
	  }
	} else {
	  vaopCalcActor.send({ type: value, value });
	}
  };


  return (
    <div>
      <input type="text" value={input} readOnly />
      <br />
      <button onClick={() => handleButtonClick('1')}>1</button>
      <button onClick={() => handleButtonClick('2')}>2</button>
      <button onClick={() => handleButtonClick('3')}>3</button>
      <button onClick={() => handleButtonClick('+')}>+</button>
      <br />
      <button onClick={() => handleButtonClick('4')}>4</button>
      <button onClick={() => handleButtonClick('5')}>5</button>
      <button onClick={() => handleButtonClick('6')}>6</button>
      <button onClick={() => handleButtonClick('-')}>-</button>
      <br />
      <button onClick={() => handleButtonClick('7')}>7</button>
      <button onClick={() => handleButtonClick('8')}>8</button>
      <button onClick={() => handleButtonClick('9')}>9</button>
      <button onClick={() => handleButtonClick('*')}>*</button>
      <br />
      <button onClick={() => handleButtonClick('0')}>0</button>
      <button onClick={() => handleButtonClick('.')}>.</button>
      <button onClick={() => handleButtonClick('=')}>=</button>
      <button onClick={() => handleButtonClick('/')}>/</button>
      <br />
      <button onClick={() => handleButtonClick('CLEAR')}>C</button>
    </div>
  );
};

export default Calculator;
