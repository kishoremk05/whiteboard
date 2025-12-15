import { useState } from 'react';
import { FileImage, FileText, FileCode, Download, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface ExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    boardTitle?: string;
}

type ExportFormat = 'png' | 'pdf' | 'svg';

const exportFormats: {
    id: ExportFormat;
    name: string;
    description: string;
    icon: React.ReactNode;
}[] = [
        {
            id: 'png',
            name: 'PNG Image',
            description: 'High-quality raster image',
            icon: <FileImage className="w-6 h-6" />,
        },
        {
            id: 'pdf',
            name: 'PDF Document',
            description: 'Print-ready document',
            icon: <FileText className="w-6 h-6" />,
        },
        {
            id: 'svg',
            name: 'SVG Vector',
            description: 'Scalable vector graphics',
            icon: <FileCode className="w-6 h-6" />,
        },
    ];

export function ExportModal({ open, onOpenChange, boardTitle = 'Board' }: ExportModalProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
    const [includeBackground, setIncludeBackground] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        // Simulate export
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsExporting(false);
        toast.success(`${boardTitle} exported as ${selectedFormat.toUpperCase()}`);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Board</DialogTitle>
                    <DialogDescription>
                        Choose a format to export your board
                    </DialogDescription>
                </DialogHeader>

                {/* Format Selection */}
                <div className="space-y-3 py-4">
                    {exportFormats.map((format) => (
                        <button
                            key={format.id}
                            onClick={() => setSelectedFormat(format.id)}
                            className={cn(
                                'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm',
                                selectedFormat === format.id
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-slate-200 hover:border-slate-300'
                            )}
                        >
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-lg flex items-center justify-center',
                                    selectedFormat === format.id
                                        ? 'bg-primary-100 text-primary-600'
                                        : 'bg-slate-100 text-slate-600'
                                )}
                            >
                                {format.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-900">{format.name}</h4>
                                <p className="text-sm text-slate-500">{format.description}</p>
                            </div>
                            {selectedFormat === format.id && (
                                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Options */}
                <div className="space-y-4 py-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="background" className="cursor-pointer">
                            Include background
                        </Label>
                        <Switch
                            id="background"
                            checked={includeBackground}
                            onCheckedChange={setIncludeBackground}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="gap-2"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Export
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
