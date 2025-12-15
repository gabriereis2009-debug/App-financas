import React, { useState, useRef } from 'react';
import { Loader2, Upload, Wand2, Image as ImageIcon, Download } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';

const AIImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract mimetype from data URL or default to jpeg
      const mimeType = selectedImage.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
      
      const result = await editImageWithGemini(selectedImage, prompt, mimeType);
      
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("O modelo não retornou uma imagem. Tente um prompt diferente.");
      }
    } catch (err) {
        console.error(err);
      setError("Falha ao processar a imagem. Verifique a chave da API ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-600" />
          Estúdio Criativo IA
        </h2>
        <p className="text-gray-500 mb-6">
          Use a IA Gemini 2.5 para editar imagens. Carregue uma imagem e diga o que mudar (ex: "Adicione um filtro retrô", "Remova o fundo").
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Original" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Clique para fazer upload de uma imagem</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Instrução para a IA</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Transforme em um desenho a lápis..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-24"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedImage || !prompt.trim() || isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all
                ${!selectedImage || !prompt.trim() || isLoading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Gerar Transformação
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-4">
             <div className="border-2 border-gray-100 bg-gray-50 rounded-lg h-64 flex flex-col items-center justify-center relative overflow-hidden">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Gerada pela IA" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4 opacity-50">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">A imagem editada aparecerá aqui</p>
                  </div>
                )}
             </div>
             
             {generatedImage && (
               <a 
                 href={generatedImage} 
                 download="gemini-edit.png"
                 className="block w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
               >
                 <Download className="w-4 h-4" />
                 Baixar Imagem
               </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageEditor;