import { useEffect, useState, useRef } from 'react';

export const useRecaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const handleRecaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    }, 110000); // 110 secondes pour actualiser le token

    return () => clearInterval(interval);
  }, []);

  return { captchaToken, recaptchaRef, handleRecaptcha };
};
