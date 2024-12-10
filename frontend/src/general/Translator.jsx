import React, { useEffect } from 'react';

const Translator = () => {
  useEffect(() => {
    // Adding gtranslateSettings script
    const gtranslateSettingsScript = document.createElement('script');
    gtranslateSettingsScript.innerHTML = `window.gtranslateSettings = { "default_language": "en", "wrapper_selector": ".gtranslate_wrapper" };`;
    document.body.appendChild(gtranslateSettingsScript);

    // Adding float.js script
    const floatScript = document.createElement('script');
    floatScript.src = `${process.env.PUBLIC_URL}/float.js`;
    floatScript.defer = true;
    document.body.appendChild(floatScript);

    // Adding lang.js script
    const langScript = document.createElement('script');
    langScript.src = `${process.env.PUBLIC_URL}/lang.js`;
    langScript.type = 'text/javascript';
    document.body.appendChild(langScript);

    // Clean up the scripts on component unmount
    return () => {
      document.body.removeChild(gtranslateSettingsScript);
      document.body.removeChild(floatScript);
      document.body.removeChild(langScript);
    };
  }, []);

  return (
    <div className="gtranslate_wrapper"></div>
  );
};

export default Translator;
