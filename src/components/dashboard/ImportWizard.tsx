import { useState } from 'react';
import { Upload, FileText, Image, FileCode, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ImportWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ImportStep = 'select' | 'upload' | 'preview' | 'complete';

const fileTypes = [
    {
        id: 'image',
        name: 'Image',
        description: 'PNG, JPG, SVG files',
        icon: Image,
        accept: '.png,.jpg,.jpeg,.svg',
    },
    {
        id: 'pdf',
        name: 'PDF',
        description: 'PDF documents',
        icon: FileText,
        accept: '.pdf',
    },
    {
        id: 'json',
        name: 'JSON',
        description: 'Canvas data files',
        icon: FileCode,
        accept: '.json',
    },
];

export function ImportWizard({ open, onOpenChange }: ImportWizardProps) {
    const [step, setStep] = useState<ImportStep>('select');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setStep('preview');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setUploadedFile(file);
            setStep('preview');
        }
    };

    const handleImport = () => {
        setStep('complete');
        setTimeout(() => {
            onOpenChange(false);
            resetWizard();
        }, 2000);
    };

    const resetWizard = () => {
        setStep('select');
        setSelectedType(null);
        setUploadedFile(null);
    };

    const handleClose = () => {
        onOpenChange(false);
        resetWizard();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Import to Board</DialogTitle>
                    <DialogDescription>
                        Import files into your canvas
                    </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 py-4">
                    {(['select', 'upload', 'preview', 'complete'] as ImportStep[]).map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                                    step === s
                                        ? 'bg-primary-500 text-white'
                                        : ['upload', 'preview', 'complete'].indexOf(step) > i
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-slate-100 text-slate-400'
                                )}
                            >
                                {['upload', 'preview', 'complete'].indexOf(step) > i ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 3 && (
                                <div
                                    className={cn(
                                        'w-12 h-0.5 mx-1',
                                        ['upload', 'preview', 'complete'].indexOf(step) > i
                                            ? 'bg-primary-500'
                                            : 'bg-slate-200'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {step === 'select' && (
                    <div className="space-y-3 py-4">
                        <p className="text-sm text-slate-500 mb-4">Select a file type to import:</p>
                        {fileTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setSelectedType(type.id);
                                    setStep('upload');
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                            >
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <type.icon className="w-6 h-6 text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-slate-900">{type.name}</p>
                                    <p className="text-sm text-slate-500">{type.description}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 ml-auto" />
                            </button>
                        ))}
                    </div>
                )}

                {step === 'upload' && (
                    <div className="py-4">
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={cn(
                                'border-2 border-dashed rounded-xl p-8 text-center transition-all',
                                isDragging
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-slate-200 hover:border-slate-300'
                            )}
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-900 font-medium mb-1">
                                Drag and drop your file here
                            </p>
                            <p className="text-sm text-slate-500 mb-4">or</p>
                            <label>
                                <input
                                    type="file"
                                    accept={fileTypes.find(t => t.id === selectedType)?.accept}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <Button variant="outline" asChild>
                                    <span>Browse Files</span>
                                </Button>
                            </label>
                        </div>
                        <div className="flex justify-between mt-4">
                            <Button variant="ghost" onClick={() => setStep('select')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'preview' && uploadedFile && (
                    <div className="py-4">
                        <div className="rounded-xl border border-slate-200 p-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">
                                        {uploadedFile.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <Check className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button variant="ghost" onClick={() => setStep('upload')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button variant="gradient" onClick={handleImport}>
                                Import File
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'complete' && (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Import Complete!
                        </h3>
                        <p className="text-slate-500">
                            Your file has been imported successfully.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
