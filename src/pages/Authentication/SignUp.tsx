import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GetPassword from '@/components/auth/GetPassword';
import toast, { Toaster } from 'react-hot-toast';
import { useRecaptcha } from '@/components/Recaptcha.v2/reCAPTCHA'; 
// Import de la fonction register
import { register } from '@/api/auth';
import ImageSlider from '@/components/auth/ImageSlider';

const SignUp: React.FC = () => {
  const { captchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

  // Déclaration des valeurs initiales
  const initialValues = {
    schoolName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  // Validation des champs avec Yup
  const validationSchema = Yup.object({
    schoolName: Yup.string().required("Le nom de l'école est obligatoire"),
    name: Yup.string().required('Le nom est obligatoire'),
    email: Yup.string()
      .email('Adresse email invalide')
      .required('L’email est obligatoire'),
    phone: Yup.string()
      // .matches(/^[0-9]{10}$/, 'Numéro de téléphone invalide')
      .required('Le téléphone est obligatoire'),
    password: Yup.string()
      .min(6, 'Le mot de passe doit comporter au moins 6 caractères')
      .required('Le mot de passe est obligatoire'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
      .required('La confirmation du mot de passe est obligatoire'),
  });

  // Fonction de soumission du formulaire
  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any,
  ) => {
    if (!captchaToken) {
      toast.error('Veuillez vérifier que vous n\'êtes pas un robot.');
      setSubmitting(false);
      return;
    }

    try {
      const data = await register(
        values.schoolName,
        values.name,
        values.email,
        values.phone,
        values.password,
      );
 
      toast.success('Inscription réussie !');
      window.location.href = '/'; // Rediriger après une inscription réussie
    } catch (error: any) {
      console.error(error);

      // Si l'erreur concerne l'existence de l'école
      if (error.message === 'This School already exists') {
        toast.error(
          'Cette école existe déjà. Veuillez vérifier les informations.',
        );
      } else {
        toast.error(error.message || 'Une erreur est survenue.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  ">
     
      <div className="flex w-full max-w-5xl overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {/* Toast Container */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Left Image Section */}
        <div className="hidden w-[40%] bg-cover lg:block">
        <ImageSlider />
        </div>

        {/* Right Form Section */}
        <div className="w-full p-2 sm:p-4 lg:w-[60%]">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
            Inscription école / Faculté
          </h2>
         
          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <Label
                      htmlFor="schoolName"
                      className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nom de l'École / Faculté
                    </Label>
                    <Field
                      as={Input}
                      id="schoolName"
                      name="schoolName"
                      type="text"
                      placeholder="Entrez le nom de votre école"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="schoolName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="name"
                      className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nom du Fondateur / Promoteur
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Entrez votre nom"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="email"
                      className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Entrez votre email"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="phone"
                      className="block mb-2 text-md font-medium text-gray-700 dark:text-gray-300"
                    >
                      Téléphone
                    </Label>
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Entrez votre numéro de téléphone"
                      className="w-full"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  
                <GetPassword
              name="password"
              placeholder="Entrez votre mot de passe"
              label="Mot de passe"
              errorMessage={<ErrorMessage name="password" component="div" />}
            />
            <GetPassword
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              label="Confirmer le mot de passe"
              errorMessage={<ErrorMessage name="confirmPassword" component="div" />}
            />
                </div>
                 <ReCAPTCHA
                     sitekey="6Lc7G7cqAAAAAMpQiVqEleigRttbltYki__egu8N"
                     ref={recaptchaRef}
                     onChange={handleRecaptcha}
                     className="mb-4"
                   />

                <Button
                  type="submit"
                  className="hover:bg-blue-800 w-full mb-4"
                  disabled={!captchaToken || formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'En cours...' : 'Créer votre école / Faculté'}
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/" className="text-md font-semibold text-blue-500  dark:text-white">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
