import React, { useState} from "react";
import StepForgetImg from "../../images/brand/Forgot password.gif";
import StepConfirmImg from "../../images/brand/Enter OTP.gif";
import StepResetImg from "../../images/brand/Reset password.gif";
import { Formik, Form, Field, ErrorMessage } from "formik";
import GetPassword from '@/components/auth/GetPassword';
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom"; 
import toast, { Toaster } from "react-hot-toast";
import { OTPInput } from "input-otp";
import { SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

import { forgetPassword, confirmCode, resetPassword } from "@/api/auth";

const AuthFlow: React.FC = () => {
  const [step, setStep] = useState<"forget" | "confirm" | "reset">("forget");
  const [matricule, setMatricule] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const navigate = useNavigate(); // Pour la redirection après réinitialisation

  const handleOtpChange = (updatedOtp: string) => {
    setOtp(updatedOtp);

    // Si le OTP est complet (6 chiffres), on soumet automatiquement
    if (updatedOtp.length === 6) {
      submitOtp(updatedOtp);
    }
  };

  const getStepImage = (step: "forget" | "confirm" | "reset") => {
    switch (step) {
      case "forget":
        return StepForgetImg;
      case "confirm":
        return StepConfirmImg;
      case "reset":
        return StepResetImg;
      default:
        return null;
    }
  };

  const initialValues = {
    matricule: "",
    password: "",
  };

  const submitOtp = async (otp: string) => {
    try { 
      await confirmCode(matricule, parseInt(otp, 10));
      setStep("reset");
      toast.success("OTP vérifié avec succès.");
    }  catch (error:any) {
      if (error.message === "Le code est invalide ou a expiré.") {
        toast.error("Le code est invalide ou a expiré. Veuillez ressayer svp !");
      } else {
        toast.error("Erreur du vérification du code OTP.");
      }
  }
  };

  return (
    <div className="flex h-screen items-center justify-center  ">
 
      <Toaster position="top-right" reverseOrder={false} />
      
      <Card className="w-full max-w-3xl mx-auto border shadow-lg overflow-hidden">
  <div className="flex flex-col md:flex-row">
    {/* Section Gauche */}
    <div className="md:w-1/2 bg-white p-6 flex flex-col items-center justify-center">

      <img
        src={getStepImage(step)} // Fonction pour récupérer l'image selon l'étape
        alt="Illustration"
        className=" object-contain"
      />
    </div>

    {/* Section Droite */}
    <div className="md:w-1/2 p-4 bg-gray-50 dark:bg-[#020617]">
    <div className="text-left">
  <button
    onClick={() => navigate("/")}
    className="flex items-center text-md font-medium text-slate-600 hover:underline"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className="mr-1"
    >
      <path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z" />
    </svg>
    Retour à la connexion
  </button>
</div>

      <CardHeader>


        <CardTitle className="text-2xl font-bold text-center mb-6">
          {step === "forget" && "Mot de passe oublié"}
          {step === "confirm" && "Vérifiez votre code OTP"}
          {step === "reset" && "Réinitialiser le mot de passe"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Étape "Mot de passe oublié" */}
        <>
   
        {step === "forget" && (
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              matricule: Yup.string().required("Le matricule est obligatoire"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await forgetPassword(values.matricule);
                setMatricule(values.matricule);
                setStep("confirm");
                toast.success("Code OTP envoyé à votre email.");
              } catch (error:any) {
                if (error.message === "Ce matricule n'existe pas.") {
                  toast.error("Matricule incorrect. Veuillez vérifier vos informations.");
                } else {
                  toast.error("Erreur lors de l'envoi du code OTP.");
                }
              } finally {
                setSubmitting(false);
              }
            }}
            
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="matricule"
                    className="mb-3 block text-md font-medium"
                  >
                    Matricule
                  </label>
                  <Field
                    as={Input}
                    id="matricule"
                    name="matricule"
                    type="text"
                    placeholder="Votre matricule"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="matricule"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Soumettre
                </Button>
              </Form>
            )}
          </Formik>
        
        )}

  {/* Confirm Step */}
  {step === "confirm" && (
              <div>
                <label className=" mb-2 text-md flex items-center justify-center">Entrez le code OTP</label>

                <OTPInput
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  containerClassName="group flex items-center justify-center"
                  render={({ slots }) => (
                    <>
                      <div className="flex">
                        {slots.slice(0, 3).map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>

                      <FakeDash />

                      <div className="flex">
                        {slots.slice(3).map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>
                    </>
                  )}
                />
              </div>
            )}

            {/* Reset Step */}
            {step === "reset" && (
              <Formik
                initialValues={{ password: "", confirm: "" }}
                validationSchema={Yup.object({
                  password: Yup.string()
                    .min(8, "Le mot de passe doit comporter au moins 8 caractères")
                    .required("Le mot de passe est obligatoire"),
                  confirm: Yup.string()
                    .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre")
                    .required("La confirmation du mot de passe est obligatoire"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await resetPassword(matricule, values.password, values.confirm);
                    toast.success("Mot de passe réinitialisé avec succès.");
                    navigate("/"); // Redirection vers la page de login
                  } catch (error) {
                    toast.error("Erreur lors de la réinitialisation du mot de passe.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {/* Matricule caché */}
                    <Field type="hidden" name="matricule" value={matricule} />

                    <div>
                    <GetPassword
              name="password"
              placeholder="Entrez votre mot de passe"
              label="Mot de passe"
              errorMessage={<ErrorMessage name="password" component="div" />}
            />
                    </div>


                    <div>
                     
                    <GetPassword
              name="confirm"
              placeholder="Confirmez votre mot de passe"
              label="Confirmer le mot de passe"
              errorMessage={<ErrorMessage name="confirm" component="div" />}
            />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      Réinitialiser
                    </Button>
                  </Form>
                )}
              </Formik>
            )}

        
              </>
      </CardContent>
    </div>
  </div>
</Card>


    </div>
  );

  function Slot(props: SlotProps) {
    return (
      <div
        className={cn(
          "relative w-10 h-14 text-[2rem]",
          "flex items-center justify-center",
          "transition-all duration-300",
          "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
          "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
          "outline outline-0 outline-accent-foreground/20",
          { "outline-2 outline-accent-foreground": props.isActive },
          { "border-transparent": props.hasFakeCaret }
        )}
      >
        <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
          {props.char ?? props.placeholderChar}
        </div>
        {props.hasFakeCaret && <FakeCaret />}
      </div>
      
    );
  }

  function FakeCaret() {
    return (
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
        <div className="w-px h-6 bg-accent-foreground/50" />
      </div>
    );
  }

  function FakeDash() {
    return <span className="px-3 text-4xl font-bold"> - </span>;
  }
};

export default AuthFlow;
