import { useState, useEffect } from "react";

export default function Dictionary() {
  const [word, setWord] = useState('');
  const [word2, setWord2] = useState('');

  useEffect(()=> {
    console.log('State Updated ' + word)
  }, [word]);

  useEffect(()=> {
    console.log('State Updated ' + word2)
  }, [word2]);

  // no dependancy array -> updates for any state change
  // empty dependacy array -> execute once
  // passing in data -> only execute when state variables are changed

  return (
    <>
      <h1>Let's get the definition for {word}</h1>
      <input type="text" onChange={(e) => setWord(e.target.value)} />

      <h2>Let's get the definition for {word2}</h2>
      <input type="text" onChange={(e) => setWord2(e.target.value)} />
    </>
  );
}
