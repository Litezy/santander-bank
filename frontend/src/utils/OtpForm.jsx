
import { useRef } from 'react'


export default function OtpForm ({pins, setPins}) {
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    const newpins = [...pins];
    newpins[index] = value;

    if (index < (pins.length - 1) && value !== '') {
      inputRefs.current[index + 1]?.focus();
    }

    setPins(newpins);
  };

  const handleInputBackspace = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && pins[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text/plain').slice(0, 6);
    const newpins = pastedText.split('').concat(pins).slice(0, pins.length);
    setPins(newpins);

    for (let i = 0; i < newpins.length; i++) {
      if (newpins[i]) {
        inputRefs.current[i].value = newpins[i];
        if (i < (pins.length + 1)) {
          inputRefs.current[i + 1]?.focus();
        }
      }
    }
  };



  return (
    <div>
      <div className='flex items-center justify-center w-full gap-2 mt-5'>
        {pins.map((part, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            placeholder='0'
            autoCapitalize="false"
            autoComplete="false"
            // autoFocus="true"
            className='border border-zinc-400 lg:h-20 h-10 w-10 p-3 lg:w-20 text-center text-2xl lg:text-5xl bg-transparent rounded-lg'
            defaultValue={part}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleInputBackspace(index, e)}
            ref={(input) => (inputRefs.current[index] = input)}
            onPaste={(e) => handlePaste(e)}
          />
        ))}
      </div>
    </div>
  )
}

