'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Image, FileJson, Table, Loader } from 'lucide-react';
import { zsColors } from '@/lib/design-system/zs-colors';
import { 
  exportChartAsPNG, 
  exportDataAsCSV, 
  exportDataAsJSON,
  exportChartsAsPDF 
} from '@/utils/export';

interface ExportOption {
  id: string;
  label: string;
  icon: any;
  format: 'png' | 'svg' | 'csv' | 'json' | 'pdf';
}

interface ExportButtonProps {
  data?: any;
  elementId?: string;
  filename?: string;
  options?: ExportOption[];
  onExport?: (format: string) => void;
  className?: string;
  variant?: 'default' | 'minimal';
}

const defaultOptions: ExportOption[] = [
  { id: 'png', label: 'Export as PNG', icon: Image, format: 'png' },
  { id: 'csv', label: 'Export as CSV', icon: Table, format: 'csv' },
  { id: 'json', label: 'Export as JSON', icon: FileJson, format: 'json' },
  { id: 'pdf', label: 'Export as PDF', icon: FileText, format: 'pdf' }
];

export function ExportButton({
  data,
  elementId,
  filename = 'export',
  options = defaultOptions,
  onExport,
  className = '',
  variant = 'default'
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportingFormat(format);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}_${timestamp}`;
      
      switch (format) {
        case 'png':
          if (elementId) {
            await exportChartAsPNG(elementId, `${exportFilename}.png`);
          }
          break;
        
        case 'csv':
          if (data && Array.isArray(data)) {
            exportDataAsCSV(data, `${exportFilename}.csv`);
          }
          break;
        
        case 'json':
          if (data) {
            exportDataAsJSON(data, `${exportFilename}.json`);
          }
          break;
        
        case 'pdf':
          if (elementId) {
            await exportChartsAsPDF([elementId], `${exportFilename}.pdf`);
          }
          break;
      }
      
      // Callback
      onExport?.(format);
      
      // Show success feedback
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  if (variant === 'minimal') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleExport('png')}
        className={`p-2 rounded-lg transition-colors ${className}`}
        style={{
          backgroundColor: zsColors.neutral.white,
          border: `1px solid ${zsColors.neutral.lightGray}`,
          color: zsColors.neutral.darkGray
        }}
        title="Export as PNG"
      >
        {isExporting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader size={16} />
          </motion.div>
        ) : (
          <Download size={16} />
        )}
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        style={{
          backgroundColor: zsColors.neutral.white,
          border: `1px solid ${zsColors.neutral.lightGray}`,
          color: zsColors.neutral.darkGray,
          boxShadow: isOpen ? zsColors.shadows.md : zsColors.shadows.sm
        }}
      >
        {isExporting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader size={16} />
          </motion.div>
        ) : (
          <Download size={16} />
        )}
        <span className="text-sm font-medium">Export</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M3 5L6 8L9 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 w-48 rounded-lg overflow-hidden z-50"
            style={{
              backgroundColor: zsColors.neutral.white,
              border: `1px solid ${zsColors.neutral.lightGray}`,
              boxShadow: zsColors.shadows.lg
            }}
          >
            {options.map((option) => {
              const isCurrentlyExporting = exportingFormat === option.format;
              const Icon = option.icon;
              
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                  className="w-full px-4 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  style={{
                    borderBottom: `1px solid ${zsColors.neutral.lightGray}`,
                    color: zsColors.neutral.charcoal
                  }}
                  whileHover={{ x: 2 }}
                >
                  {isCurrentlyExporting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader size={16} />
                    </motion.div>
                  ) : (
                    <Icon size={16} style={{ color: zsColors.neutral.gray }} />
                  )}
                  <span className="text-sm">{option.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Quick export buttons for common formats
export function QuickExportButtons({
  data,
  elementId,
  filename = 'export',
  className = ''
}: {
  data?: any;
  elementId?: string;
  filename?: string;
  className?: string;
}) {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleQuickExport = async (format: 'png' | 'csv') => {
    setExportingFormat(format);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}_${timestamp}`;
      
      if (format === 'png' && elementId) {
        await exportChartAsPNG(elementId, `${exportFilename}.png`);
      } else if (format === 'csv' && data) {
        exportDataAsCSV(data, `${exportFilename}.csv`);
      }
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleQuickExport('png')}
        className="p-2 rounded-lg transition-colors"
        style={{
          backgroundColor: zsColors.neutral.white,
          border: `1px solid ${zsColors.neutral.lightGray}`,
          color: zsColors.neutral.darkGray
        }}
        title="Export as PNG"
        disabled={exportingFormat === 'png'}
      >
        {exportingFormat === 'png' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader size={14} />
          </motion.div>
        ) : (
          <Image size={14} aria-label="Export as PNG" />
        )}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleQuickExport('csv')}
        className="p-2 rounded-lg transition-colors"
        style={{
          backgroundColor: zsColors.neutral.white,
          border: `1px solid ${zsColors.neutral.lightGray}`,
          color: zsColors.neutral.darkGray
        }}
        title="Export as CSV"
        disabled={exportingFormat === 'csv'}
      >
        {exportingFormat === 'csv' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader size={14} />
          </motion.div>
        ) : (
          <Table size={14} aria-label="Export as CSV" />
        )}
      </motion.button>
    </div>
  );
}