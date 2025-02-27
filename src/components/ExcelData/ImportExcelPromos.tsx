import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import { addPromo } from "@/api/promos";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ImportExcelProps {
 
  onImportSuccess: () => void;
}
const FILE_EXCEL_TEMPLATE_URL = "/public/Import_format_Data/Example_Format_Data.xlsx";

const ImportExcelPromos: React.FC<ImportExcelProps> = ({ onImportSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]); // Liste des noms de feuilles
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null); // Feuille sélectionnée

  // Ref pour cibler l'input fichier
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Gérer la fermeture et l'ouverture du modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetState();
  };

  // Fonction pour réinitialiser tous les états
  const resetState = () => {
    setPreviewData([]);
    setFileName(null);
    setSheetNames([]);
    setSelectedSheet(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Réinitialise le champ de fichier
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = FILE_EXCEL_TEMPLATE_URL;
    link.download = "format_import_data.xlsx";
    link.click();
  };

  // Fonction pour gérer l'importation du fichier
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Aucun fichier sélectionné.");
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetNames = workbook.SheetNames;

      setSheetNames(sheetNames); // Met à jour la liste des feuilles disponibles
      setSelectedSheet(sheetNames[0]); // Sélectionne par défaut la première feuille

      // Charger les données de la première feuille sélectionnée par défaut
      const worksheet = workbook.Sheets[sheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        toast.error("Le fichier est vide ou invalide.");
        setFileName(null);
        return;
      }

      setPreviewData(jsonData);
      toast.success(`Fichier ${file.name} chargé avec succès !`);
    } catch (error) {
      console.error("Erreur lors de l'importation :", error);
      toast.error("Erreur lors de l'importation du fichier.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les données de la feuille sélectionnée
  const handleSheetSelection = async (sheetName: string) => {
    setSelectedSheet(sheetName);
    setLoading(true);

    try {
      const data = await fileInputRef.current?.files?.[0].arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      setPreviewData(jsonData);
    } catch (error) {
      console.error("Erreur lors du chargement des données de la feuille :", error);
      toast.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour valider et envoyer les données au backend
  const handleDataSubmit = async () => {
    if (previewData.length === 0) {
      toast.error("Aucune donnée à importer.");
      return;
    }

    setLoading(true);

    try {
      for (const record of previewData) {
        const { name} = record;

        if (!name ) {
          toast.error("Certains enregistrements contiennent des erreurs.");
          continue;
        }

        await addPromo(name);
      }

      toast.success("Importation réussie !");
      onImportSuccess(); // Recharge la liste après import
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      toast.error("Erreur lors de l'envoi des données au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Button onClick={openModal}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z" clipRule="evenodd" />
  <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
</svg>

        Importer un fichier </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer un fichier Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
              <Button onClick={handleDownloadTemplate}   variant="default">
                                      Voir le format du fichier
                </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {fileName && (
              <p className="text-sm text-gray-600">
                Fichier sélectionné : <strong>{fileName}</strong>
              </p>
            )}

            {/* Sélecteur de feuilles */}
            {sheetNames.length > 0 && (
          <div>
          <label htmlFor="sheetSelect" className="block text-sm font-medium text-gray-700">
            Sélectionnez une feuille :
          </label>
          <select
            id="sheetSelect"
            value={selectedSheet || ""}
            onChange={(e) => handleSheetSelection(e.target.value)}
            disabled={loading}
            className="mt-1 block w-1/2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
            style={{ float: 'left' }}
          >
            {sheetNames.map((sheetName, index) => (
              <option key={index} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </div>
    
            )}

            {/* Aperçu des données */}
            {previewData.length > 0 && (
              <div className="pt-8">
                <h3 className=" text-left text-lg font-medium mb-2">Aperçu des données :</h3>
                <div className="max-h-64 overflow-auto border rounded-lg">
                  <table className="min-w-full text-sm text-gray-500">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        {Object.keys(previewData[0]).map((key, index) => (
                          <th key={index} className="px-4 py-2">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr> 
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={resetState} disabled={loading}>
              Réinitialiser
            </Button>
            <Button
              variant="primary"
              onClick={handleDataSubmit}
              disabled={loading || previewData.length === 0}
            >
              {loading ? "Importation..." : "Valider et importer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportExcelPromos;
