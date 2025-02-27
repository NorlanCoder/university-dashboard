import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { RootState } from "@/app/store";
import { fetchUserInfo, updateProfile, updateProfileSchool, updatePassword } from "@/api/profiles";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from "@/features/auth/authSlice";
import GetPassword from "@/components/auth/GetPassword";
import { motion } from "framer-motion";

const Profile: React.FC<{}> = () => {

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
      },
    },
  };


  interface PersonalInfo {
    name: string;
    matricule: string;
    email: string;
    phone: string;
    photo: string | ArrayBuffer | null;
  };

  interface SchoolInfo {
    adress: string,
    moy: string | null,
    email: string;
    phone: string;
    name: string;
    image: string | ArrayBuffer | null;
  };


  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const mySchool = useSelector((state: RootState) => state.auth.mySchool);



  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: user?.name || "",
    matricule: user?.matricule || "",
    email: user?.email || "",
    phone: user?.phone || "",
    photo: user?.photo || "",
  });

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    adress: user?.school?.adress || "",
    moy: user?.school?.moy || null,
    email: user?.school?.email || "",
    phone: user?.school?.phone || "",
    name: user?.school?.name || "",
    image: user?.school?.image || "",
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserInfo();
        setPersonalInfo({
          name: data.name,
          email: data.email,
          phone: data.phone,
          matricule: data.matricule,
          photo: data.photo || null,
        });
        setSchoolInfo({
          adress: data.school.adress,
          moy: data.school.moy || null,
          email: data.school.email,
          phone: data.school.phone,
          name: data.school.name,
          image: data.school.image || null,
        });

      } catch (error) {

      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values: any, section: string) => {
    if (section === "personal") {
      try {
        const formData = {
          email: values.email,
          phone: values.phone,
          photo: values.photo as File,
        };
        const response = await updateProfile(formData);


        dispatch(updateUserInfo(response.data));


        toast.success("Informations personnelles mises à jour avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour des informations.");
      }

    }
    else if (section === "school") {
      try {
        const formData = {
          adress: values.adress,
          moy: values.moy,
          email: values.email,
          phone: values.phone,
          name: values.name,
          image: values.image as File,
        };
        const response = await updateProfileSchool(formData);
        dispatch(updateUserInfo(response.data));

        toast.success("Informations universitaires mises à jour avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour des informations universitaires.");
      }
    }
    else if (section === "password") {
      if (values.newPassword !== values.confirmPassword) {
        toast.error("Les nouveaux mots de passe ne correspondent pas.");
      } else {
        try {
          await updatePassword(values.currentPassword, values.newPassword, values.confirmPassword);
          toast.success("Mot de passe mis à jour avec succès.");
        } catch (error) {
          toast.error("Erreur lors de la mise à jour du mot de passe.");
        }
      }
    }

  };

  const personalSchema = Yup.object().shape({
    name: Yup.string().required("Nom complet est requis"),
    email: Yup.string().email("Email invalide").required("Email est requis"),
    phone: Yup.string().required("Téléphone est requis"),
  });

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Le mot de passe actuel est requis"),
    newPassword: Yup.string()
      .required("Le nouveau mot de passe est requis")
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
      .required("Confirmation du mot de passe est requise"),
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl">Profil</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <motion.div

        className="flex flex-col gap-6 py-6 space-y-6">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Section Informations School */}
        {mySchool && (
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Informations Universitaires</CardTitle>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={schoolInfo}
                  validationSchema={Yup.object().shape({
                    adress: Yup.string().required("Adresse est requise"),
                    moy: Yup.string().nullable(),
                    email: Yup.string().email("Email invalide").required("Email est requis"),
                    phone: Yup.string().required("Téléphone est requis"),
                    name: Yup.string().required("Nom de l'école est requis"),
                  })}
                  onSubmit={(values) => handleSubmit(values, "school")}
                >
                  {({ setFieldValue, isSubmitting }) => (
                    <Form>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="schoolName" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">
                              Nom de l'école
                            </Label>
                            <Field as={Input} id="schoolName" name="name" />
                            <ErrorMessage name="schoolName" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <Label htmlFor="adress" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">
                              Adresse
                            </Label>
                            <Field as={Input} id="adress" name="adress" />
                            <ErrorMessage name="adress" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <Label htmlFor="moy" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">
                              Moyenne
                            </Label>
                            <Field as={Input} id="moy" name="moy" />
                            <ErrorMessage name="moy" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <Label htmlFor="email" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">
                              Email
                            </Label>
                            <Field as={Input} id="email" name="email" type="email" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="mb-4 block text-gray-800 dark:text-gray-50 text-md" >
                              Téléphone
                            </Label>
                            <Field as={Input} id="phone" name="phone" />
                            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <Label htmlFor="image" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">
                              Image de l'école
                            </Label>
                            <Input
                              id="image"
                              type="file"
                              onChange={(e) => setFieldValue("image", e.target.files?.[0])}
                            />
                          </div>
                        </div>
                        <Button type="submit" className="mt-6" disabled={isSubmitting}>
                          Mettre à jour
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Section Informations Personnelles */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={personalInfo}
                validationSchema={personalSchema}
                onSubmit={(values) => handleSubmit(values, "personal")}
              >
                {({ setFieldValue, isSubmitting }) => (
                  <Form>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div >
                          <Label htmlFor="Matricule" className="mb-4 block text-gray-800 dark:text-gray-50 text-md ">Matricule</Label>
                          <Field as={Input} id="matricule" name="matricule" disabled />
                          <ErrorMessage name="matricule" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="name" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">Nom Complet</Label>
                          <Field as={Input} id="name" name="name" disabled />
                          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="email" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">Email</Label>
                          <Field as={Input} id="email" name="email" type="email" />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="mb-4 block text-gray-800 dark:text-gray-50 text-md">Téléphone</Label>
                          <Field as={Input} id="phone" name="phone" />
                          <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="photo " className="mb-4 block text-gray-800 dark:text-gray-50 text-md">Photo de profil</Label>
                          <Input id="photo" type="file" onChange={(e) => setFieldValue("photo", e.target.files?.[0])} />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="mt-6" disabled={isSubmitting}>Mettre à jour</Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section Modification de Mot de Passe */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Modifier le mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={passwordSchema}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values, "password"); // Traitez les valeurs soumises
                  resetForm(); // Réinitialise les champs du formulaire
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="space-y-4">
                      <div>
                        <GetPassword
                          name="currentPassword"
                          placeholder="Entrez votre mot de passe actuel"
                          label="Mot de passe actuel"
                          errorMessage={<ErrorMessage name="currentPassword" component="div" />}
                        />
                      </div>
                      <div>
                        <GetPassword
                          name="newPassword"
                          placeholder="Entrez un nouveau mot de passe"
                          label="Nouveau mot de passe"
                          errorMessage={<ErrorMessage name="newPassword" component="div" />}
                        />
                      </div>
                      <div>
                        <GetPassword
                          name="confirmPassword"
                          placeholder="Confirmer le mot de passe"
                          label="Confirmer le nouveau mot de passe"
                          errorMessage={<ErrorMessage name="confirmPassword" component="div" />}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="mt-4 block" disabled={isSubmitting}>
                      Changer le mot de passe
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
