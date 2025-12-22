import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image, FileCode, Check, ArrowRight, ArrowLeft, Sparkles, FileImage, File, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useBoards } from '../../contexts/BoardContext';
import { toast } from 'sonner';

interface ImportWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ImportStep = 'select' | 'upload' | 'preview' | 'importing' | 'complete';

const fileTypes = [
    {
        id: 'image',
        name: 'Images',
        description: 'PNG, JPG, SVG, WebP files',
        icon: Image,
        accept: '.png,.jpg,.jpeg,.svg,.webp',
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-600',
    },
    {
        id: 'pdf',
        name: 'Documents',
        description: 'PDF documents to annotate',
        icon: FileText,
        accept: '.pdf',
        color: 'from-blue-500 to-indigo-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
    },
    {
        id: 'json',
        name: 'Canvas Export',
        description: 'Import previous board exports',
        icon: FileCode,
        accept: '.json',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
    },
];

export function ImportWizard({ open, onOpenChange }: ImportWizardProps) {
    const navigate = useNavigate();
    const { createBoard } = useBoards();
    const [step, setStep] = useState<ImportStep>('select');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [importProgress, setImportProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate preview URL for images
    useEffect(() => {
        if (uploadedFile && selectedType === 'image') {
            const url = URL.createObjectURL(uploadedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        return () => {};
    }, [uploadedFile, selectedType]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setError(null);
            setUploadedFile(file);
            setStep('preview');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            // Validate file type
            const selectedFileType = fileTypes.find(t => t.id === selectedType);
            const acceptedExtensions = selectedFileType?.accept.split(',') || [];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            
            if (!acceptedExtensions.some(ext => ext.toLowerCase() === fileExtension)) {
                setError(`Invalid file type. Please upload ${selectedFileType?.description}`);
                return;
            }
            
            setError(null);
            setUploadedFile(file);
            setStep('preview');
        }
    };

    const handleImport = async () => {
        if (!uploadedFile) return;
        
        setStep('importing');
        setImportProgress(0);
        
        // Simulate import progress
        const interval = setInterval(() => {
            setImportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        await new Promise(resolve => setTimeout(resolve, 2000));
        clearInterval(interval);
        setImportProgress(100);
        
        // Create a new board with the imported file name
        const fileName = uploadedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
        const board = await createBoard(`Imported: ${fileName}`);
        
        setTimeout(() => {
            setStep('complete');
            toast.success('Import successful!', {
                description: `Created board "${board.title}"`,
            });
        }, 300);
    };

    const resetWizard = () => {
        setStep('select');
        setSelectedType(null);
        setUploadedFile(null);
        setPreviewUrl(null);
        setImportProgress(0);
        setError(null);
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(resetWizard, 300);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const steps = ['select', 'upload', 'preview', 'complete'] as const;
    const stepLabels = ['Select Type', 'Upload', 'Preview', 'Done'];
    const currentStepIndex = steps.indexOf(step === 'importing' ? 'preview' : step as typeof steps[number]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg p-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle>Import to Board</DialogTitle>
                                <DialogDescription>
                                    Bring your files into the canvas
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mt-6">
                        {steps.map((s, i) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                                            currentStepIndex > i
                                                ? 'bg-primary-500 text-white'
                                                : currentStepIndex === i
                                                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                                                    : 'bg-slate-100 text-slate-400'
                                        )}
                                    >
                                        {currentStepIndex > i ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            i + 1
                                        )}
                                    </div>
                                    <span className={cn(
                                        'text-xs mt-1.5 font-medium transition-colors',
                                        currentStepIndex >= i ? 'text-slate-700' : 'text-slate-400'
                                    )}>
                                        {stepLabels[i]}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="flex-1 mx-2 mb-6">
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    'h-full bg-primary-500 rounded-full transition-all duration-500',
                                                    currentStepIndex > i ? 'w-full' : 'w-0'
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="px-6 py-6">
                    {step === 'select' && (
                        <div className="space-y-3 animate-in fade-in-0 slide-in-from-right-4 duration-300">
                            <p className="text-sm text-slate-500 mb-4">What would you like to import?</p>
                            {fileTypes.map((type, index) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedType(type.id);
                                        setStep('upload');
                                    }}
                                    className={cn(
                                        'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300',
                                        'hover:shadow-lg hover:-translate-y-0.5 hover:border-primary-300',
                                        'border-slate-200 bg-white',
                                        'animate-in fade-in-0 slide-in-from-bottom-2'
                                    )}
                                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                                >
                                    <div className={cn(
                                        'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white',
                                        type.color
                                    )}>
                                        <type.icon className="w-7 h-7" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-semibold text-slate-900">{type.name}</p>
                                        <p className="text-sm text-slate-500">{type.description}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'upload' && (
                        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={fileTypes.find(t => t.id === selectedType)?.accept}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    'border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer',
                                    isDragging
                                        ? 'border-primary-500 bg-primary-50 scale-[1.02]'
                                        : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                                )}
                            >
                                <div className={cn(
                                    'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300',
                                    isDragging ? 'bg-primary-100 scale-110' : 'bg-slate-100'
                                )}>
                                    <Upload className={cn(
                                        'w-10 h-10 transition-colors',
                                        isDragging ? 'text-primary-500' : 'text-slate-400'
                                    )} />
                                </div>
                                <p className="text-slate-900 font-semibold mb-1">
                                    {isDragging ? 'Drop your file here' : 'Drag and drop your file'}
                                </p>
                                <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <span className="px-2 py-1 bg-slate-100 rounded-full">
                                        {fileTypes.find(t => t.id === selectedType)?.accept}
                                    </span>
                                    <span>Max 10MB</span>
                                </div>
                            </div>
                            
                            {error && (
                                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-between mt-6">
                                <Button variant="ghost" onClick={() => setStep('select')} className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && uploadedFile && (
                        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
                            <div className="rounded-2xl border border-slate-200 overflow-hidden mb-4">
                                {/* Preview Image */}
                                {previewUrl && selectedType === 'image' && (
                                    <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                )}
                                
                                {/* File Info */}
                                <div className="p-4 bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            'w-12 h-12 rounded-xl flex items-center justify-center',
                                            fileTypes.find(t => t.id === selectedType)?.bgColor
                                        )}>
                                            {selectedType === 'image' ? (
                                                <FileImage className={cn("w-6 h-6", fileTypes.find(t => t.id === selectedType)?.textColor)} />
                                            ) : (
                                                <File className={cn("w-6 h-6", fileTypes.find(t => t.id === selectedType)?.textColor)} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 truncate">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatFileSize(uploadedFile.size)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setUploadedFile(null);
                                                    setPreviewUrl(null);
                                                    setStep('upload');
                                                }}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between">
                                <Button variant="ghost" onClick={() => setStep('upload')} className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button variant="gradient" onClick={handleImport} className="gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Import File
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'importing' && (
                        <div className="py-8 text-center animate-in fade-in-0 duration-300">
                            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Importing your file...
                            </h3>
                            <p className="text-slate-500 mb-6">This won't take long</p>
                            
                            <div className="max-w-xs mx-auto">
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(importProgress, 100)}%` }}
                                    />
                                </div>
                                <p className="text-sm text-slate-400 mt-2">
                                    {Math.round(Math.min(importProgress, 100))}%
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="py-8 text-center animate-in fade-in-0 zoom-in-95 duration-300">
                            <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-emerald-600" />
                                <div className="absolute -inset-1 rounded-full border-4 border-emerald-200 animate-ping opacity-50" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Import Complete! 🎉
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Your file has been imported and a new board was created
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button variant="outline" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="gradient" onClick={() => {
                                    handleClose();
                                    // Navigate to the most recent board (the one just created)
                                    navigate('/dashboard');
                                }}>
                                    Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
