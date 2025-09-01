import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, FileText, Table, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateSamplePerformanceReport, generateSampleAuditData } from '../../../../shared/demo-data';

interface SampleExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleExportModal({ isOpen, onClose }: SampleExportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Download the pre-generated PDF sample
      const link = document.createElement('a');
      link.href = '/samples/rugira_monthly_performance_report_sample.pdf';
      link.download = 'rugira_monthly_performance_report_sample.pdf';
      link.click();
      
      setGeneratedFiles(prev => [...prev, 'Performance Report']);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = async () => {
    setIsGenerating(true);
    try {
      // Download the pre-generated CSV sample
      const link = document.createElement('a');
      link.href = '/samples/rugira_audit_extract_sample.csv';
      link.download = 'rugira_audit_extract_sample.csv';
      link.click();
      
      setGeneratedFiles(prev => [...prev, 'Audit Extract']);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setGeneratedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sample Export Center</DialogTitle>
          <DialogDescription>
            Download sample reports with simulated trading data for demonstration purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Banner */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                  Sample Data Only
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  All files contain simulated data and are clearly marked for demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Performance Report</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly summary PDF</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Sample / Simulated Data</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {generatedFiles.includes('Performance Report') && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                <Button 
                  onClick={downloadPDF}
                  disabled={isGenerating}
                  size="sm"
                  data-testid="button-export-pdf"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download Sample (PDF)
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Table className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Audit Extract</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trade history CSV</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Sample / Simulated Data</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {generatedFiles.includes('Audit Extract') && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                <Button 
                  onClick={downloadCSV}
                  disabled={isGenerating}
                  size="sm"
                  data-testid="button-export-csv"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download Sample (CSV)
                </Button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center py-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Figures are simulated and for demonstration only. Not investment advice.
            </p>
          </div>

          {generatedFiles.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">
                    Files Downloaded
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {generatedFiles.join(', ')} downloaded successfully
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} data-testid="button-close-export">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}