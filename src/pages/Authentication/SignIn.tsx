import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha'; // Import de reCAPTCHA
import GetPassword from '@/components/auth/GetPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Import des fonctionnalités nécessaires
import { login } from '@/api/auth';
import { useDispatch } from 'react-redux';
import { authenticated } from '@/features/auth/authSlice';
import { useRecaptcha } from '@/components/Recaptcha.v2/reCAPTCHA'; 
import Loader from '@/components/Loader/loader';

const SignIn: React.FC = () => {
  const { captchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    matricule: '',
    password: '',
  };

  const validationSchema = Yup.object({
    matricule: Yup.string()
      .min(3, 'Le matricule doit comporter au moins 3 caractères')
      .required('Le matricule est obligatoire'),
    password: Yup.string()
      .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
      .required('Le mot de passe est obligatoire'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    if (!captchaToken) {
      toast.error('Veuillez vérifier que vous n\'êtes pas un robot.');
      setSubmitting(false);
      return;
    }

    try {
      const data = await login(values.matricule, values.password);
      toast.success('Connexion réussie !');
      dispatch(authenticated({ 
        user: data.data.user,
        session: data.data.session,
        expires: data.data.expires,
        mySchool: data.data.mySchool, 
      })); 

    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="flex w-full max-w-5xl overflow-hidden border shadow-lg md:flex-row">
        <div className="hidden w-full md:block md:w-1/2 flex items-center justify-center">
          <img src="/src/images/brand/secure_login.gif" alt="Secure Login" className="w-auto" />
        </div>

        <div className="w-full p-6 md:w-1/2">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Connexion</CardTitle>
            <CardTitle className="text-center text-md font-normal">Accédez à votre espace administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label htmlFor="matricule" className="block text-md font-medium">Matricule</label>
                      <ErrorMessage name="matricule" component="div" className="text-red-500 text-sm" />
                    </div>
                    <Field as={Input} id="matricule" className="max-w-md" name="matricule" placeholder="Votre matricule" />
                  </div>
                  <GetPassword
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    label="Mot de passe"
                    errorMessage={<ErrorMessage name="password" component="div" />}
                  />
                  <ReCAPTCHA
                    sitekey="6Lc7G7cqAAAAAMpQiVqEleigRttbltYki__egu8N"
                    ref={recaptchaRef}
                    onChange={handleRecaptcha}
                    className="mb-4"
                  />
                <Link
                      to="/reset-password"
                      className="text-sm text-[#0f172a] dark:text-white hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isValid || !dirty || !captchaToken}
                  >
                    {isSubmitting ? <Loader /> : 'Connexion'}
                  </Button>
                </Form>
              )}
            </Formik>
            <p className="mt-4 text-center text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-medium hover:underline">Inscrivez-vous</Link>
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
 