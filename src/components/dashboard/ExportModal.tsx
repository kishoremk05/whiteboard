import { useState, useRef, useEffect } from 'react';
import { FileImage, FileText, FileCode, Download, Check, Settings2, Sparkles, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
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
type ExportQuality = 'low' | 'medium' | 'high';

const exportFormats: {
    id: ExportFormat;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}[] = [
    {
        id: 'png',
        name: 'PNG Image',
        description: 'High-quality raster image for sharing',
        icon: <FileImage className="w-6 h-6" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
    },
    {
        id: 'pdf',
        name: 'PDF Document',
        description: 'Print-ready document format',
        icon: <FileText className="w-6 h-6" />,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
    },
    {
        id: 'svg',
        name: 'SVG Vector',
        description: 'Scalable vector for editing',
        icon: <FileCode className="w-6 h-6" />,
        color: 'text-violet-600',
        bgColor: 'bg-violet-50',
    },
];

const qualityOptions: { id: ExportQuality; label: string; scale: number }[] = [
    { id: 'low', label: 'Standard', scale: 1 },
    { id: 'medium', label: 'High', scale: 2 },
    { id: 'high', label: 'Ultra', scale: 4 },
];

export function ExportModal({ open, onOpenChange, boardTitle = 'Board' }: ExportModalProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
    const [selectedQuality, setSelectedQuality] = useState<ExportQuality>('medium');
    const [includeBackground, setIncludeBackground] = useState(true);
    const [includePadding, setIncludePadding] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setExportSuccess(false);
        }
    }, [open]);

    const downloadFile = (dataUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    };

    const handleExport = async () => {
        if (!previewRef.current) {
            toast.error('Export failed', { description: 'Preview element not found' });
            return;
        }

        setIsExporting(true);

        try {
            const quality = qualityOptions.find(q => q.id === selectedQuality)?.scale || 2;
            const filename = `${boardTitle.replace(/[^a-zA-Z0-9]/g, '_')}`;

            const options = {
                quality: 1,
                pixelRatio: quality,
                backgroundColor: includeBackground ? '#f8fafc' : undefined,
            };

            let dataUrl: string;

            switch (selectedFormat) {
                case 'png':
                    dataUrl = await htmlToImage.toPng(previewRef.current, options);
                    downloadFile(dataUrl, `${filename}.png`);
                    break;

                case 'svg':
                    dataUrl = await htmlToImage.toSvg(previewRef.current, options);
                    downloadFile(dataUrl, `${filename}.svg`);
                    break;

                case 'pdf':
                    // For PDF, we export as PNG first then create a simple PDF
                    dataUrl = await htmlToImage.toPng(previewRef.current, { ...options, pixelRatio: 2 });
                    
                    // Create a simple HTML page with the image for printing as PDF
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                        printWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>${boardTitle}</title>
                                <style>
                                    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                                    img { max-width: 100%; height: auto; }
                                    @media print { body { margin: 0; } img { width: 100%; } }
                                </style>
                            </head>
                            <body>
                                <img src="${dataUrl}" alt="${boardTitle}" />
                                <script>
                                    window.onload = function() {
                                        setTimeout(function() {
                                            window.print();
                                            window.close();
                                        }, 500);
                                    };
                                </script>
                            </body>
                            </html>
                        `);
                        printWindow.document.close();
                    } else {
                        // Fallback: download as PNG if popup blocked
                        downloadFile(dataUrl, `${filename}.png`);
                        toast.info('Popup blocked', { description: 'Downloaded as PNG instead. Allow popups for PDF export.' });
                    }
                    break;
            }

            setIsExporting(false);
            setExportSuccess(true);
            toast.success(`${boardTitle} exported as ${selectedFormat.toUpperCase()}`, {
                description: 'Your file is ready',
            });

            // Reset after showing success
            setTimeout(() => {
                setExportSuccess(false);
                onOpenChange(false);
            }, 1500);
        } catch (error) {
            console.error('Export error:', error);
            setIsExporting(false);
            toast.error('Export failed', {
                description: error instanceof Error ? error.message : 'An error occurred during export',
            });
        }
    };

    const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader className="pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Download className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">Export Board</DialogTitle>
                            <DialogDescription className="text-sm">
                                Download "{boardTitle}" in your preferred format
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Hidden preview element for export */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                    <div
                        ref={previewRef}
                        style={{
                            width: '800px',
                            padding: includePadding ? '40px' : '0',
                            backgroundColor: includeBackground ? '#f8fafc' : 'transparent',
                        }}
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">{boardTitle}</h1>
                                    <p className="text-slate-500">Created with CanvasAI</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-lg bg-white/80 shadow-sm" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary-500" />
                                    <span className="text-sm text-slate-600">Exported from CanvasAI</span>
                                </div>
                                <span className="text-sm text-slate-400">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Format Selection */}
                <div className="py-4">
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">
                        Export Format
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                        {exportFormats.map((format) => (
                            <button
                                key={format.id}
                                onClick={() => setSelectedFormat(format.id)}
                                className={cn(
                                    'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-200',
                                    selectedFormat === format.id
                                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                                        selectedFormat === format.id
                                            ? `${format.bgColor} ${format.color}`
                                            : 'bg-slate-100 text-slate-500'
                                    )}
                                >
                                    {format.icon}
                                </div>
                                <div>
                                    <p className={cn(
                                        'font-medium text-sm',
                                        selectedFormat === format.id ? 'text-slate-900' : 'text-slate-600'
                                    )}>
                                        {format.name.split(' ')[0]}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {format.name.split(' ')[1]}
                                    </p>
                                </div>
                                {selectedFormat === format.id && (
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shadow-sm">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quality Selection (only for PNG) */}
                {selectedFormat === 'png' && (
                    <div className="py-4 border-t border-slate-100">
                        <Label className="text-sm font-medium text-slate-700 mb-3 block">
                            Export Quality
                        </Label>
                        <div className="flex gap-2">
                            {qualityOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedQuality(option.id)}
                                    className={cn(
                                        'flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all',
                                        selectedQuality === option.id
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    )}
                                >
                                    {option.label}
                                    <span className="block text-xs text-slate-400 mt-0.5">{option.scale}x</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Options */}
                <div className="py-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Settings2 className="w-4 h-4 text-slate-400" />
                        <Label className="text-sm font-medium text-slate-700">
                            Export Options
                        </Label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <Label htmlFor="background" className="cursor-pointer text-sm font-medium text-slate-700">
                                Include background
                            </Label>
                            <p className="text-xs text-slate-400 mt-0.5">Add canvas background color</p>
                        </div>
                        <Switch
                            id="background"
                            checked={includeBackground}
                            onCheckedChange={setIncludeBackground}
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <Label htmlFor="padding" className="cursor-pointer text-sm font-medium text-slate-700">
                                Include padding
                            </Label>
                            <p className="text-xs text-slate-400 mt-0.5">Add margin around content</p>
                        </div>
                        <Switch
                            id="padding"
                            checked={includePadding}
                            onCheckedChange={setIncludePadding}
                        />
                    </div>
                </div>

                {/* Preview info */}
                <div className="py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', selectedFormatData?.bgColor, selectedFormatData?.color)}>
                            {selectedFormatData?.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">
                                {boardTitle}.{selectedFormat}
                            </p>
                            <p className="text-xs text-slate-400">
                                {selectedFormat === 'png' && `${qualityOptions.find(q => q.id === selectedQuality)?.scale}x resolution`}
                                {selectedFormat === 'pdf' && 'Print-ready quality'}
                                {selectedFormat === 'svg' && 'Vector format'}
                            </p>
                        </div>
                        <Sparkles className="w-4 h-4 text-primary-400" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={handleExport}
                        disabled={isExporting || exportSuccess}
                        className="gap-2 min-w-[140px]"
                    >
                        {exportSuccess ? (
                            <>
                                <Check className="w-4 h-4" />
                                Exported!
                            </>
                        ) : isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Export {selectedFormat.toUpperCase()}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
